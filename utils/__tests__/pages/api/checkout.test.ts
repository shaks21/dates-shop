import handler from '@/pages/api/checkout';
import { createMocks } from 'node-mocks-http';

test('handles valid cart post request', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: { cart: [{ id: '1', title: 'Ajwa', price: 10 }] },
  });

  await handler(req, res);

  expect(res._getStatusCode()).toBe(200);
  expect(res._getJSONData()).toEqual({ success: true });
});
