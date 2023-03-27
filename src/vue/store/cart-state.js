import { defineStore } from 'pinia'
import {
  generateFetchRequest,
  focusElement,
  calculateTotal,
  temporalUpdateBubbleCartCount
} from '@/lib/utilities'

import {
  hasDiscounts,
  discountTotal,
  applyDiscount,
  removeDiscount,
  applyGiftCard,
  removeGiftCard,
  validateCartItem,
  handleResponseOrError
} from '@/lib/utilities-cart'

import { ERROR_MESSAGES } from '@/lib/error-messages.js';
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
      return miniCartRevertedOrder ? this.items.reverse() : this.items;
    },
    isEmpty() {
      return this.items?.length === 0;
    },
    totalAmount() {
      return calculateTotal(this.items, (item) => item.price * item.quantity);
    },
    totalItems() {
      return calculateTotal(this.items, (item) => item.quantity);
    },
    hasProductType(productType) {
      if (!productType || this.items.length == 0) return false
      return this.items.some((item) => item.product_type === productType);
    },
    hasProductTag(productTag) {
      if (!productTag || this.items.length == 0) return false
      return this.items.some((item) => item?.tags?.includes(productTag));
    },
    hasDiscounts() {
      return hasDiscounts(this.items);
    },
    discountTotal() {
      return discountTotal(this.items);
    },
    subtotal() {
      return calculateTotal(this.items, (item) => item.original_line_price) || 0;
    },
    taxes() {
      return calculateTotal(this.items, (item) => item.total_tax) || 0;
    },
    shipping() {
      return this.items.reduce((total, item) => total + item.line_level_shipping_price, 0) || 0;
    },
    total() {
      return this.subtotal + this.taxes + this.shipping - this.discountTotal || 0;
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

    async addToCart({ id, quantity = 1, properties = false, selling_plan = null }) {
      const error = validateCartItem({ id, quantity, properties });
      if (error) {
        this.error = error;
        return handleResponseOrError(null, error);
      }
      if (this.cartRequested === false) await this.fetchCart()

      const _id = cleanProductVariantId(id.toString())
      const requestBody = {
        id: _id.toString(),
        quantity
      };
      if (properties) {
        requestBody.properties = properties;
      }
      if (selling_plan) {
        requestBody.selling_plan = selling_plan;
      }

      const itemAlreadyOnCart = await this.isProductInCart(_id);

      if (itemAlreadyOnCart) {
        if (properties && itemAlreadyOnCart.properties) {
          const propertiesAreDifferent = JSON.stringify(itemAlreadyOnCart.properties) !== JSON.stringify(properties);
          if (!propertiesAreDifferent) {
            requestBody.quantity = itemAlreadyOnCart.quantity + quantity
            return this.updateCartItem(requestBody);
          }
        } else {
          requestBody.quantity = itemAlreadyOnCart.quantity + quantity
          return this.updateCartItem(requestBody);
        }
      }

      this.isLoading = true
      try {
        const response =
          await generateFetchRequest('/cart/add.js', 'POST', requestBody, null)

        this.items.length === 0
          ? this.items.push(response.data)
          : this.items = [response.data].concat(this.items)

        setTimeout(() => {
          this.error = null
          this.isOpen = true
          temporalUpdateBubbleCartCount(this.totalItems)
        }, 0)
        return handleResponseOrError(response, null);
      } catch (error) {
        this.error = error
        return handleResponseOrError(null, error);
      } finally {
        this.isLoading = false
      }
    },

    async updateCartItem({ id, quantity = 1, properties = false, selling_plan = null }) {
      const error = validateCartItem({ id, quantity, properties });
      if (error) {
        this.error = error;
        return handleResponseOrError(null, error);
      }

      this.isLoading = true
      const _id = cleanProductVariantId(id.toString())
      const requestBody = {
        id: _id.toString(),
        quantity
      };
      if (properties) {
        requestBody.properties = properties;
      }

      if (selling_plan) {
        requestBody.selling_plan = selling_plan;
      }

      try {
        const response =
          await generateFetchRequest('/cart/change.js', 'POST', requestBody, null)

        this.items = []

        setTimeout(() => {
          this.items = response.data.items
          this.error = null
          this.isOpen = true
          temporalUpdateBubbleCartCount(this.totalItems)
          return handleResponseOrError(response, null);
        }, 0)

      } catch (error) {
        this.error = error
        return handleResponseOrError(null, this.error);
      } finally {
        this.isLoading = false
      }
    },

    removeCartItem(id) {
      if (this.isProductInCart(id)) {
        this.updateCartItem({ id, quantity: 0 })
      } else {
        return handleResponseOrError(null, ERROR_MESSAGES.PRODUCT_NOT_IN_CART);
      }
    },

    isProductInCart(id) {
      return this.items.find(item => item.id === Number(id))
    },

    async applyDiscount(discountCode) {
      return applyDiscount(discountCode)
    },

    async removeDiscount() {
      return removeDiscount()
    },

    async applyGiftCard(giftCardCode) {
      return applyGiftCard(giftCardCode)
    },

    async removeGiftCard(giftCardId) {
      return removeGiftCard(giftCardId)
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
  addToCart: async (item) => {
    const cart = useCartStoreDefinition();
    const response = await cart.addToCart(item);
    return response
  }
}
