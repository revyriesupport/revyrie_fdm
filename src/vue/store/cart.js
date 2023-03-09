import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: {}
  }),
  getters: {
    totalAmount: (state) => state.cart,
    lineItems() {
      return []
    },
    lineItemsCount() {
      return this.lineItems.length
    },
  },
  actions: {
    cartCreate() {
      console.log('cartCreate!!!!!')
    },
    addToCart() {

    },
    removeFromCart() {

    },
    updateCartItem() {

    },
  }
})