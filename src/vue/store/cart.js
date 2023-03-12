import { defineStore } from 'pinia'
import { generateFetchRequest, cleanProductVariantId } from '../../lib/utilities'

export const useCartStore = defineStore({
  id: 'cart',
  state: () => ({
    items: [],
    isOpen: true,
    isLoading: false,
    error: null,

  }),
  getters: {
    totalAmount() {
      return this.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    totalItems() {
      return this.items.reduce((total, item) => total + item.quantity, 0)
    },
    hasProductType() {
      return (productType) => this.items.some(item => item.product_type === productType)
    },
    hasProductTag() {
      return (productTag) => this.items.some(item => item.tags.includes(productTag))
    },
    isEmpty() {
      return this.items?.length === 0
    },
    hasDiscounts() {
      return this.items.some(item => item.discount_applications?.length > 0) || false
    },
    discountTotal() {
      return this.items.reduce((total, item) => total + item.final_line_price - item.original_line_price, 0)
    },
    subtotal() {
      return this.items.reduce((total, item) => total + item.original_line_price, 0)
    },
    taxes() {
      return this.items.reduce((total, item) => total + item.total_tax, 0) || 0
    },
    shipping() {
      return this.items.reduce((total, item) => total + item.line_level_shipping_price, 0) || 0
    },
    total() {
      return this.subtotal + this.taxes + this.shipping - this.discountTotal || 0
    }
  },
  actions: {
    async fetchCart() {
      this.isLoading = true
      try {
        const response = await generateFetchRequest('/cart.js', 'GET', null, null)
        this.items = response.data.items || []
        this.isLoading = false
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },

    async addToCart(variantId, quantity = 1) {
      this.isLoading = true
      try {
        const response = await generateFetchRequest('/cart/add.js', 'POST', {
          id: variantId,
          quantity: quantity
        }, null)
        this.items = response.data.items
        this.isLoading = false
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },

    async updateCartItem(key, quantity) {
      this.isLoading = true
      try {
        const response = await generateFetchRequest('/cart/change.js', 'POST', {
          key: key,
          quantity: quantity
        }, null)
        this.items = response.data.items

        this.isLoading = false
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },

    async removeCartItem(key) {
      this.isLoading = true
      try {
        const response = await generateFetchRequest('/cart/change.js', 'POST', {
          key: key,
          quantity: 0
        }, null)
        this.items = response.data.items

        this.isLoading = false
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },
    async applyDiscount(discountCode) {
      this.isLoading = true
      try {
        const response = await generateFetchRequest('/discount/' + discountCode + '/apply.js', 'POST', null, null)
        this.items = response.data.items

        this.isLoading = false
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },

    async removeDiscount() {
      this.isLoading = true
      try {
        const response = await generateFetchRequest('/discount/remove.js', 'POST', null, null)
        this.items = response.data.items

        this.isLoading = false
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },

    async applyGiftCard(giftCardCode) {
      this.isLoading = true
      try {
        const response = await generateFetchRequest('/gift_cards/' + giftCardCode + '/apply.js', 'POST', null, null)
        this.items = response.data.items

        this.isLoading = false
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },

    async removeGiftCard(giftCardId) {
      this.isLoading = true
      try {
        const response = await generateFetchRequest('/gift_cards/' + giftCardId + '/remove.js', 'POST', null, null)
        this.items = response.data.items

        this.isLoading = false
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },

    checkout() {
      window.location.href = '/checkout'
    },
  }
})

// export const useCartStore = defineStore('cart', {
//   state: () => ({
//     open: false,
//     items: [],
//     isLoading: false,
//     error: null,
//     cart: {}
//   }),
//   getters: {
//     totalAmount: (state) => state.cart?.total_price || 0,
//     lineItems: (state) => state.cart?.items || [],
//     lineItemsCount: (state) => state.cart?.items?.length || 0,
//   },
//   actions: {
//     getCart() {
//       makeFetchRequest({
//         url: '/cart.js',
//         method: 'GET',
//         callback: (data) => {
//           this.cart = data
//         }
//       });
//     },
//     addToCart({ id: storefrontID, quantity = 1 }) {
//       if (!storefrontID) return
//       const id = cleanProductVariantId(storefrontID)
//       const data = {
//         id,
//         quantity
//       };

//       makeFetchRequest({
//         url: '/cart/add.js',
//         method: 'POST',
//         body: data,
//         callback: (data) => {
//           console.log('New product:', data)
//           this.cart.items.push(data)
//         }
//       });
//     },
//     updateCartItem({ id: storefrontID, quantity = 1 }) {
//       if (!storefrontID) return
//       const id = cleanProductVariantId(storefrontID)
//       const data = {
//         id,
//         quantity
//       };
//       makeFetchRequest({
//         url: '/cart/update.js',
//         method: 'POST',
//         body: data,
//         callback: (data) => {
//           console.log('Product Updated!', data)
//         }
//       });
//     },
//     removeFromCart() {
//       console.log('-----> removeFromCart')
//     },
//     }
//   }
// })
