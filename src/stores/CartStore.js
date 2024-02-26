import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    totalItems() {
      return this.items.reduce((total, item) => total + item.quantidade, 0);
    },
    totalPrice() {
      return this.items.reduce((total, item) => total + (item.valor * item.quantidade), 0);
    },
  },
  actions: {
    addItem(item) {
      console.log(JSON.stringify(item));
      const existingItemIndex = this.items.findIndex(i => i._id === item._id);
      if (existingItemIndex !== -1) {
        this.items[existingItemIndex].quantidade++;
      } else {
        this.items.push({...item, quantidade: 1});
      }
    },
    removeItem(itemId) {
      const index = this.items.findIndex(item => item._id === itemId);
      if (index !== -1) {
        if (this.items[index].quantidade === 1) {
          this.items.splice(index, 1);
        } else {
          this.items[index].quantidade--;
        }
      }
    },
    clearCart() {
      this.items = [];
    },
  },
});
