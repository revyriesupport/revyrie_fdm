import { defineStore } from 'pinia'
import { makeFetchRequest, cleanProductVariantId } from '../../lib/utilities'

export const useCartStore = defineStore('cart', {
  state: () => ({
    open: false,
    cart: {}
  }),
  getters: {
    totalAmount: (state) => state.cart?.total_price || 0,
    lineItems: (state) => state.cart?.items || [],
    lineItemsCount: (state) => state.cart?.items?.length || 0,
  },
  actions: {
    getCart() {
      makeFetchRequest({
        url: '/cart.js',
        method: 'GET',
        callback: (data) => {
          this.cart = data
        }
      });
    },
    addToCart({ id: storefrontID, quantity = 1 }) {
      if (!storefrontID) return

      const id = cleanProductVariantId(storefrontID)
      console.log('id:', id)
      const data = {
        id,
        quantity
      };

      makeFetchRequest({
        url: '/cart/add.js',
        method: 'POST',
        body: data,
        callback: (data) => {
          console.log('New product:', data)
          this.cart.items.push(data)
        }
      });
    },
    removeFromCart() { },
    updateCartItem() { },
  }
})
