import { defineStore } from 'pinia'
import {
  generateFetchRequest,
  focusElement,
  calculateTotal,
  temporalUpdateBubbleCartCount
} from '@/lib/utilities'
import { cartItemLimit } from "@/lib/store-definition";
import { cleanProductVariantId } from '@/lib/utilities-graphql'
import { miniCartRevertedOrder } from '@/lib/store-definition'

const useCartStoreDefinition = defineStore({
  id: 'cart',
  state: () => ({
    items: [],
    isOpen: false,
    isLoading: false,
    error: null,
    cartRequested: false
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
      return calculateTotal(this.items, (item) => item.price * item.quantity);
    },
    totalItems() {
      return calculateTotal(this.items, (item) => item.quantity);
    },
    hasProductType(productType) {
      // this.hasProductType.call(this, productType);
      return this.items.some(item => item.product_type === productType);
    },
    hasProductTag(productTag) {
      return this.items.some(item => item.tags.includes(productTag));
    },
    hasDiscounts() {
      return this.items.some(item => item.discount_applications?.length > 0) || false
    },
    discountTotal() {
      return calculateTotal(this.items, (item) => item.final_line_price - item.original_line_price) || 0;
    },
    subtotal() {
      return calculateTotal(this.items, (item) => item.original_line_price) || 0;
    },
    taxes() {
      return calculateTotal(this.items, (item) => item.total_tax) || 0;
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
        document.body.style.overflow = 'inherit'
        if (document.querySelector('.shopify-section-header-sticky:not(.shopify-section-header-hidden)')) {
          focusElement('#header-cart-icon')
        }
      }

      if (this.isOpen && this.cartRequested === false) {
        this.fetchCart()
      }
    },

    async fetchCart() {
      this.isLoading = true
      try {
        const response = await generateFetchRequest('/cart.js', 'GET', null, null)
        this.items = response.data.items || []
        this.isLoading = false
        this.cartRequested = true
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },

    async addToCart(key, quantity = 1, callback) {
      if (!key) return
      if (this.validateCartItemLimitQuantity(quantity)) return
      if (this.cartRequested === false) await this.fetchCart()

      const id = cleanProductVariantId(key.toString())
      const itemAlreadyOnCart = await this.isProductInCart(id);
      if (itemAlreadyOnCart) {
        this.updateCartItem(id, itemAlreadyOnCart.quantity + quantity)
        return
      }

      this.isLoading = true
      try {
        const response = await generateFetchRequest('/cart/add.js', 'POST', {
          id: id.toString(),
          quantity: quantity
        }, null)

        this.isLoading = false

        console.log('this.items.length', this.items.length)

        this.items.length === 0
          ? this.items.push(response.data)
          : this.items = [response.data].concat(this.items)

        if (callback) {
          callback(response)
        }

        this.isOpen = true
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

      if (this.validateCartItemLimitQuantity(quantity)) return

      try {
        const response = await generateFetchRequest('/cart/change.js', 'POST', {
          id: id.toString(),
          quantity: quantity
        }, null)
        this.items = []

        setTimeout(() => {
          this.items = response.data.items
          if (callback) {
            callback(response)
          }
          this.isLoading = false
          temporalUpdateBubbleCartCount(this.totalItems)
          this.isOpen = true
        }, 0)
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },

    removeCartItem(id) {
      if(this.isProductInCart(id)){
        this.updateCartItem(id, 0)
      } else {
        console.warn('Product not in cart')
      }
    },

    isProductInCart(id) {
      return this.items.find(item => item.id === Number(id))
    },

    validateCartItemLimitQuantity(quantity) {
      if (quantity > cartItemLimit) {
        alert(`The maximum quantity allowed for each item is ${cartItemLimit}`)
        console.warn(`The maximum quantity allowed for each item is ${cartItemLimit}`)
      }
      return quantity > cartItemLimit
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
