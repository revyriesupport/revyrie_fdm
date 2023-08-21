import { defineStore } from 'pinia'
import {
  generateFetchRequest,
  focusElement,
  calculateTotal,
  temporalUpdateBubbleCartCount
} from '@/lib/utilities'

import {
  generateBodyObject,
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
    open() {
      this.isOpen = true
      document.body.classList.add('cart-drawer-open')
    },
    toggle() {
      this.isOpen = !this.isOpen

      if (this.isOpen) {
        document.body.classList.add('cart-drawer-open')
        focusElement('#close-mini-cart')
      } else {
        document.body.classList.remove('cart-drawer-open')
        if (document.querySelector('.shopify-section-header-sticky:not(.shopify-section-header-hidden)')) {
          focusElement('#cart-icon-bubble')
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
        return handleResponseOrError(null, error);
      }
    },

    async addToCart({ id, quantity = 1, properties = false, selling_plan = null }) {
      const error = validateCartItem({ id, quantity, properties });
      if (error) {
        return handleResponseOrError(null, error);
      }
      if (this.cartRequested === false) {
        await this.fetchCart()
      }

      const _id = cleanProductVariantId(id.toString())
      let requestBody = generateBodyObject({
        id: _id.toString(),
        quantity,
        properties,
        selling_plan
      })

      const itemAlreadyOnCart = this.isProductInCartById(_id);
      if (itemAlreadyOnCart) {
        const itemWithSameIdAndSameProperties = this.items
          .find(item => item.id === _id
            && JSON.stringify(item.properties) === JSON.stringify(properties || {})
          )

        if (itemWithSameIdAndSameProperties) {
          requestBody = generateBodyObject({
            key: itemAlreadyOnCart.key,
            quantity: quantity + itemAlreadyOnCart.quantity,
            properties,
            selling_plan
          })
          return this.updateCartItemFetch(requestBody)
        }

        requestBody.key = itemAlreadyOnCart.key
      }

      this.isLoading = true
      try {
        const response =
          await generateFetchRequest('/cart/add.js', 'POST', requestBody, null)

        this.items.length === 0
          ? this.items.push(response.data)
          : this.items = [response.data].concat(this.items)

        this.open()
        temporalUpdateBubbleCartCount(this.totalItems)

        return handleResponseOrError(response, null);
      } catch (error) {
        return handleResponseOrError(null, error);
      } finally {
        this.isLoading = false
      }
    },

    async updateCartItem({ key, quantity = 1, properties = false, selling_plan = null }) {
      const error = validateCartItem({ key, quantity, properties });
      if (error) { return handleResponseOrError(null, error); }

      this.isLoading = true
      const requestBody = generateBodyObject({
        key: key,
        quantity,
        properties,
        selling_plan
      })

      return await this.updateCartItemFetch(requestBody)
    },


    async updateCartItemFetch(requestBody) {
      const error = validateCartItem({ key: requestBody.key });
      if (error) { return handleResponseOrError(null, error); }

      const key = requestBody.key
      const updateRequestBody = {
        updates: {
          [key]: requestBody.quantity
        }
      }
      try {
        const response =
          await generateFetchRequest('/cart/update.js', 'POST', updateRequestBody, null)

        this.items = response.data.items
        this.open();
        temporalUpdateBubbleCartCount(this.totalItems)

        return handleResponseOrError(response, null);
      } catch (error) {
        return handleResponseOrError(null, error);
      } finally {
        this.isLoading = false
      }
    },

    async changeCartItemFetch(requestBody) {
      try {
        const response =
          await generateFetchRequest('/cart/change.js', 'POST', requestBody, null)

        this.items = response.data.items
        this.open();
        temporalUpdateBubbleCartCount(this.totalItems)
        return handleResponseOrError(response, null);

      } catch (error) {
        return handleResponseOrError(null, error);
      } finally {
        this.isLoading = false
      }
    },

    removeCartItem(key) {
      if (this.isProductInCartByKey(key)) {
        return this.updateCartItem({ key, quantity: 0 })
      } else {
        return handleResponseOrError(null, ERROR_MESSAGES.PRODUCT_NOT_IN_CART);
      }
    },


    isProductInCartById(id) {
      return this.items.find(item => item.id === id)
    },

    isProductInCartByKey(key) {
      return this.items.find(item => item.key === key)
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
  openCart: () => {
    const cart = useCartStoreDefinition();
    cart.open();
  },
  addToCart: async (item) => {
    const cart = useCartStoreDefinition();
    const response = await cart.addToCart(item);
    return response
  }
}
