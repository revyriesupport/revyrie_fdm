import { defineStore } from 'pinia'
import { generateFetchRequest, cleanProductVariantId } from '../../lib/utilities'

export const useCartStore = defineStore({
  id: 'cart',
  state: () => ({
    items: [],
    isOpen: false,
    isLoading: false,
    error: null,
  }),
  getters: {
    isEmpty() {
      return this.items?.length === 0
    },
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
    toggle() { this.isOpen = !this.isOpen },

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

    async addToCart(key, quantity = 1) {
      this.isLoading = true
      const id = cleanProductVariantId(key.toString())
      try {
        const response = await generateFetchRequest('/cart/add.js', 'POST', {
          id: id,
          quantity: quantity
        }, null)
        this.items = response.data.items
        this.isLoading = false
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },

    async updateCartItem(key, quantity, callback) {
      this.isLoading = true
      const id = cleanProductVariantId(key.toString())
      try {
        const response = await generateFetchRequest('/cart/change.js', 'POST', {
          id: id,
          quantity: quantity
        }, null)
        this.items = response.data.items
        if (callback) {
          callback(response)
        }
        this.isLoading = false
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },

    removeCartItem(id) {
      this.updateCartItem(id, 0)
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
