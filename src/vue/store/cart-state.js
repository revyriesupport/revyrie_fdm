import { defineStore } from 'pinia'
import {
  generateFetchRequest,
  focusElement,
  calculateTotal,
  temporalUpdateBubbleCartCount
} from '@/lib/utilities'

import {
  generateBodyObject,
  getIndexOfElementWithSameIdAndProperties,
  getItemOfElementWithSameIdAndProperties,
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
    note: '',
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
      return !this.isEmpty
        ? calculateTotal(this.items, (item) => item.price * item.quantity)
        : 0
    },
    totalItems() {
      return !this.isEmpty
        ? calculateTotal(this.items, (item) => item.quantity)
        : 0
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
        this.note = response.data.note || ''
        this.isLoading = false
        this.cartRequested = true
      } catch (error) {
        this.isLoading = false
      }
    },

    async addToCart({ id, quantity = 1, properties = false, selling_plan = null }) {
      const error = validateCartItem({ id, quantity, properties });
      if (error) {
        return handleResponseOrError(null, error);
      }
      if (this.cartRequested === false) await this.fetchCart()

      const _id = cleanProductVariantId(id.toString())
      let requestBody = generateBodyObject({
        id: _id.toString(),
        quantity,
        properties,
        selling_plan
      })

      const itemAlreadyOnCart = await this.isProductInCart(_id);
      console.log('itemAlreadyOnCart:', itemAlreadyOnCart)

      if (itemAlreadyOnCart) {
        const elementsWithSameId = this.items.filter((item) => item.id === _id)
        const elementWithSameProperties = elementsWithSameId.find((item) => JSON.stringify(item.properties) === JSON.stringify(properties))
        // elementWithSameProperties
        if (false) {
          const element = getItemOfElementWithSameIdAndProperties(this.items, _id, properties)
          requestBody = generateBodyObject({
            line: element.key,
            quantity: element.quantity + quantity,
            properties,
            selling_plan
          })
          return this.updateCartItemFetch(requestBody)
        } else {
          requestBody = generateBodyObject({
            id: itemAlreadyOnCart.id,
            quantity: quantity + itemAlreadyOnCart.quantity,
            properties,
            selling_plan
          })
          return this.updateCartItemFetch(requestBody)
        }
      }

      this.isLoading = true
      try {
        const response =
          await generateFetchRequest('/cart/add.js', 'POST', requestBody, null)

        this.items.length === 0
          ? this.items.push(response.data)
          : this.items = [response.data].concat(this.items)

        console.log('this.items:', this.items)

        setTimeout(() => {
          this.isOpen = true
          console.log('this.isOpen:', this.isOpen)
          temporalUpdateBubbleCartCount(this.totalItems)
        }, 0)
        return handleResponseOrError(response, null);
      } catch (error) {
        return handleResponseOrError(null, error);
      } finally {
        this.isLoading = false
      }
    },

    async updateCartItem({ id, quantity = 1, properties = false, selling_plan = null }) {
      const error = validateCartItem({ id, quantity, properties });
      if (error) {
        return handleResponseOrError(null, error);
      }

      this.isLoading = true
      const _id = cleanProductVariantId(id.toString())
      const requestBody = generateBodyObject({
        id: _id.toString(),
        quantity,
        properties,
        selling_plan
      })

      return await this.updateCartItemFetch(requestBody)
    },

    async updateCartItemFetch(requestBody) {
      try {
        const response =
          await generateFetchRequest('/cart/change.js', 'POST', requestBody, null)

        // this.items = []

        setTimeout(() => {
          this.items = response.data.items
          this.isOpen = true
          temporalUpdateBubbleCartCount(this.totalItems)
        }, 0)
        return handleResponseOrError(response, null);

      } catch (error) {
        return handleResponseOrError(null, error);
      } finally {
        this.isLoading = false
      }
    },

    removeCartItem(id) {
      if (this.isProductInCart(id)) {
        return this.updateCartItem({ id, quantity: 0 })
      } else {
        return handleResponseOrError(null, ERROR_MESSAGES.PRODUCT_NOT_IN_CART);
      }
    },

    isProductInCart(id) {
      return this.items.find(item => item.id === Number(id))
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

    updateNote(note) {
      this.note = note;
    },
    checkout() {
      const checkoutUrl = `/checkout?note=${encodeURIComponent(this.note)}`;
      window.location.href = checkoutUrl;
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
