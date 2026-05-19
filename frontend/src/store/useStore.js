import { create } from 'zustand';

export const useStore = create((set, get) => ({
  cart: [],
  addToCart: (item) => set((state) => {
    const existing = state.cart.find(i => i.id === item.id);
    if (existing) {
      return { cart: state.cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),
  decrementCart: (id) => set((state) => {
    const existing = state.cart.find(i => i.id === id);
    if (existing && existing.quantity > 1) {
      return { cart: state.cart.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i) };
    }
    return { cart: state.cart.filter(i => i.id !== id) };
  }),
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(i => i.id !== id)
  })),
  updateQuantity: (id, quantity) => set((state) => {
    if (quantity <= 0) {
      return { cart: state.cart.filter(i => i.id !== id) };
    }
    return { cart: state.cart.map(i => i.id === id ? { ...i, quantity } : i) };
  }),
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
