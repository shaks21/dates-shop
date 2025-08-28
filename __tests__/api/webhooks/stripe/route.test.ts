// __tests__/api/webhooks/stripe/route.test.ts

// Step 1: Create mock functions
const mockConstructEvent = jest.fn();
const mockRetrieveSession = jest.fn();

// Step 2: Mock 'stripe' — define implementation inside, don't reference outside vars directly
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: (...args: any[]) => mockConstructEvent(...args),
    },
    checkout: {
      sessions: {
        retrieve: (...args: any[]) => mockRetrieveSession(...args),
      },
    },
  }));
});

// Step 3: Now import the route (after mocking)
import { POST } from '@/app/api/webhooks/stripe/route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Step 4: Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    order: {
      create: jest.fn(),
    },
  },
}));

// Set environment variables
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock';

describe('Stripe Webhook Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Request validation', () => {
    it('should return 400 if no stripe signature header is present', async () => {
      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(req);
      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody.error).toBe('Missing stripe signature');
    });

    it('should return 500 if webhook verification fails', async () => {
      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'invalid-signature',
        },
        body: 'test-body',
      });

      mockConstructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const response = await POST(req);
      const responseBody = await response.json();

      expect(response.status).toBe(500);
      expect(responseBody.error).toBe('Webhook handler failed');
      expect(mockConstructEvent).toHaveBeenCalledWith(
        'test-body',
        'invalid-signature',
        'whsec_mock'
      );
    });
  });

  describe('Event handling', () => {
    it('should return 200 for non-checkout events', async () => {
      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'valid-signature',
        },
        body: 'test-body',
      });

      mockConstructEvent.mockReturnValue({
        type: 'invoice.payment_succeeded',
        data: { object: {} },
      });

      const response = await POST(req);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.received).toBe(true);
    });

    it('should handle checkout.session.completed for registered user', async () => {
      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'valid-signature',
        },
        body: 'test-body',
      });

      const mockSession = {
        id: 'cs_test_123',
        payment_status: 'paid',
        metadata: {
          userId: 'user_123',
        },
        customer_email: 'test@example.com',
      };

      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: mockSession },
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user_123',
        email: 'test@example.com',
      });

      mockRetrieveSession.mockResolvedValue({
        line_items: {
          data: [
            {
              quantity: 2,
              price: {
                unit_amount: 1000,
                product: {
                  id: 'prod_stripe_123',
                  metadata: {
                    productId: 'product_123',
                  },
                },
              },
            },
          ],
        },
      });

      (prisma.order.create as jest.Mock).mockResolvedValue({
        id: 'order_123',
        userId: 'user_123',
        status: 'completed',
        total: 20.0,
        orderItems: [],
      });

      const response = await POST(req);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.received).toBe(true);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user_123' },
      });

      expect(mockRetrieveSession).toHaveBeenCalledWith('cs_test_123', {
        expand: ['line_items.data.price.product'],
      });

      expect(prisma.order.create).toHaveBeenCalledWith({
        data: {
          userId: 'user_123',
          guestEmail: null,
          status: 'completed',
          total: 20.0,
          orderItems: {
            create: [
              {
                productId: 'product_123',
                quantity: 2,
                price: 10.0,
              },
            ],
          },
          metadata: {
            stripeSessionId: 'cs_test_123',
            isGuestOrder: false,
            customerEmail: 'test@example.com',
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    it('should handle checkout.session.completed for guest user', async () => {
      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'valid-signature',
        },
        body: 'test-body',
      });

      const mockSession = {
        id: 'cs_guest_123',
        payment_status: 'paid',
        metadata: {},
        customer_email: 'guest@example.com',
      };

      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: mockSession },
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      mockRetrieveSession.mockResolvedValue({
        line_items: {
          data: [
            {
              quantity: 1,
              price: {
                unit_amount: 1500,
                product: {
                  id: 'prod_stripe_456',
                  metadata: {
                    productId: 'product_456',
                  },
                },
              },
            },
          ],
        },
      });

      (prisma.order.create as jest.Mock).mockResolvedValue({
        id: 'order_guest_123',
        userId: null,
        guestEmail: 'guest@example.com',
        status: 'completed',
        total: 15.0,
        orderItems: [],
      });

      const response = await POST(req);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.received).toBe(true);

      expect(prisma.order.create).toHaveBeenCalledWith({
        data: {
          userId: null,
          guestEmail: 'guest@example.com',
          status: 'completed',
          total: 15.0,
          orderItems: {
            create: [
              {
                productId: 'product_456',
                quantity: 1,
                price: 15.0,
              },
            ],
          },
          metadata: {
            stripeSessionId: 'cs_guest_123',
            isGuestOrder: true,
            customerEmail: 'guest@example.com',
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    it('should skip unpaid sessions', async () => {
      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'valid-signature',
        },
        body: 'test-body',
      });

      const mockSession = {
        id: 'cs_unpaid_123',
        payment_status: 'unpaid',
        metadata: {},
        customer_email: 'test@example.com',
      };

      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: mockSession },
      });

      const response = await POST(req);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.received).toBe(true);

      expect(prisma.order.create).not.toHaveBeenCalled();
      expect(mockRetrieveSession).not.toHaveBeenCalled();
    });

    it('should handle user lookup by email fallback', async () => {
      const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'valid-signature',
        },
        body: 'test-body',
      });

      const mockSession = {
        id: 'cs_test_456',
        payment_status: 'paid',
        metadata: {
          userEmail: 'fallback@example.com',
        },
        customer_email: 'fallback@example.com',
      };

      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: mockSession },
      });

      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 'user_456',
          email: 'fallback@example.com',
        });

      mockRetrieveSession.mockResolvedValue({
        line_items: {
          data: [
            {
              quantity: 1,
              price: {
                unit_amount: 2000,
                product: {
                  id: 'prod_789',
                  metadata: { productId: 'product_789' },
                },
              },
            },
          ],
        },
      });

      (prisma.order.create as jest.Mock).mockResolvedValue({
        id: 'order_456',
      });

      const response = await POST(req);
      expect(response.status).toBe(200);

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(2);
      expect(prisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user_456',
            guestEmail: null,
          }),
        })
      );
    });
  });
});