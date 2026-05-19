const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = {
  getMenu: async (restaurant = 'a2b') => {
    const res = await fetch(`${API_BASE}/menu?restaurant=${restaurant}`);
    return res.json();
  },
  placeOrder: async (orderData) => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },
  
  // Admin Methods
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },
  
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`);
    return res.json();
  },

  getProducts: async () => {
    const res = await fetch(`${API_BASE}/products`);
    return res.json();
  },

  // Menu CRUD
  addMenuItem: async (itemData) => {
    const res = await fetch(`${API_BASE}/menu/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    return res.json();
  },
  updateMenuItem: async (id, itemData) => {
    const res = await fetch(`${API_BASE}/menu/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    return res.json();
  },
  deleteMenuItem: async (id) => {
    const res = await fetch(`${API_BASE}/menu/items/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Product CRUD
  addProduct: async (prodData) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prodData)
    });
    return res.json();
  },
  updateProduct: async (id, prodData) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prodData)
    });
    return res.json();
  },
  deleteProduct: async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    return res.json();
  }
};
