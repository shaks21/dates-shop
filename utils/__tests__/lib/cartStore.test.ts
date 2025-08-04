import { useCartStore } from '@/lib/stores/cartStore';

beforeEach(() => {
  localStorage.clear();
  useCartStore.getState().clearCart();
});

test('adds item to cart', () => {
  const store = useCartStore.getState();
  store.addToCart({
    title: 'Ajwa',
    price: 100,
    slug: 'ajwa',
    image: '',
    description: '',
  });
  expect(store.cart.length).toBe(1);
  expect(store.cart[0].title).toBe('Ajwa');
  expect(store.cart[0].quantity).toBe(1);
});
