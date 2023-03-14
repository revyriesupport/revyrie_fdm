import { defineStore } from 'pinia'
import {
  generateFetchRequest,
  cleanProductVariantId,
  focusElement
} from '@/lib/utilities'
import { miniCartRevertedOrder } from '@/lib/store-definition'

const temporalUpdateBubbleCartCount = (count) => {
  count === 0
    ? document.querySelector('.cart-count-bubble').classList.add('hidden')
    : document.querySelector('.cart-count-bubble').classList.remove('hidden')
  document.querySelector('.cart-count-bubble span[aria-hidden="true"]').innerText = count
}

const useCartStoreDefinition = defineStore({
  id: 'cart',
  state: () => ({
    items: [],
    isOpen: false,
    isLoading: false,
    error: null
  }),
  getters: {
    listItems() {
      return miniCartRevertedOrder
        ? this.items.reverse()
        : this.items
    },
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
    toggle() {
      this.isOpen = !this.isOpen

      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
        focusElement('#close-mini-cart')
      } else {
        document.body.style.overflow = 'auto'
        if (document.querySelector('.shopify-section-header-sticky:not(.shopify-section-header-hidden)')) {
          focusElement('#header-cart-icon')
        }
      }

      if (this.isOpen) {
        if (this.items.length === 0) {
          this.fetchCart()
        }
      }
    },

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

    async addToCart(key, quantity = 1, callback) {
      if (!key) return
      const id = cleanProductVariantId(key.toString())

      // const validateIfItemIsInCart = this.items.find(item => item.id === parseInt(id))
      // console.log('validateIfItemIsInCart:', validateIfItemIsInCart)
      // if (validateIfItemIsInCart) {
      //   this.updateCartItem(id, validateIfItemIsInCart.quantity + quantity)
      //   return
      // }

      this.isLoading = true
      try {
        const response = await generateFetchRequest('/cart/add.js', 'POST', {
          id: id,
          quantity: quantity
        }, null)

        this.isOpen = true
        this.isLoading = false

        console.log('this.items.length', this.items.length)

        this.items.length === 0
          ? this.items.push(response.data)
          : this.items = [response.data].concat(this.items)

        if (callback) {
          callback(response)
        }
        temporalUpdateBubbleCartCount(this.totalItems)
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },

    async updateCartItem(key, quantity, callback) {
      if (!key) return
      const id = cleanProductVariantId(key.toString())
      this.isLoading = true
      try {
        const response = await generateFetchRequest('/cart/change.js', 'POST', {
          id: id,
          quantity: quantity
        }, null)
        console.log('----> Data', response.data)
        this.items = response.data.items
        if (callback) {
          callback(response)
        }
        this.isLoading = false
        temporalUpdateBubbleCartCount(this.totalItems)
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

export const useCartStore = useCartStoreDefinition


window.theme = {
  toggleCart: () => {
    const cart = useCartStoreDefinition();
    cart.toggle();
  },
  validateNewItem: (item, callback) => {
    const cart = useCartStoreDefinition();
    const itemAlreadyOnCart = cart.items.find(cartItem => cartItem.id === item.id);
    itemAlreadyOnCart
      ? cart.items.find(cartItem => cartItem.id === item.id).quantity = item.quantity
      : cart.items = [item].concat(cart.items)

    if (callback) {
      callback();
    }
  }
}
