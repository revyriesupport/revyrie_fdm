import { defineStore } from 'pinia'
import {
  generateFetchRequest,
  focusElement,
  calculateTotal,
  temporalUpdateBubbleCartCount,
  duplicateCartItemsBaseOnProperties,
} from '@/lib/utilities'

import { ERROR_MESSAGES } from '@/lib/error-messages.js';
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
      return this.items.some((item) => item.discount_applications?.length > 0) || false;
    },
    discountTotal() {
      return (
        calculateTotal(this.items, (item) => item.final_line_price - item.original_line_price) || 0
      );
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

    async addToCart({ id, quantity = 1, properties = false }) {
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


      const itemAlreadyOnCart = await this.isProductInCart(_id);
      if (itemAlreadyOnCart) {
        requestBody.quantity = itemAlreadyOnCart.quantity + quantity
        return this.updateCartItem(requestBody);
      }
      // if (itemAlreadyOnCart && itemAlreadyOnCart.properties) {
      //   console.log('itemAlreadyOnCart:', itemAlreadyOnCart)
      //   if (properties && JSON.stringify(itemAlreadyOnCart.properties) === JSON.stringify(properties)) {
      //     console.log('Is equal', itemAlreadyOnCart.properties, properties)
      //     requestBody.quantity = itemAlreadyOnCart.quantity + quantity
      //     this.updateCartItem(requestBody)
      //     return
      //   }
      //   console.log('Is not equal', itemAlreadyOnCart.properties, properties)
      // }

      this.isLoading = true
      try {
        const response =
          await generateFetchRequest('/cart/add.js', 'POST', requestBody, null)

        this.items.length === 0
          ? this.items.push(response.data)
          : this.items = [response.data].concat(this.items)

        this.isOpen = true
        this.error = null
        temporalUpdateBubbleCartCount(this.totalItems)

        return handleResponseOrError(response, null);
      } catch (error) {
        this.error = error
        return handleResponseOrError(null, error);
      } finally {
        this.isLoading = false
      }
    },

    async updateCartItem({ id, quantity = 1, properties = false }) {
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

      try {
        const response =
          await generateFetchRequest('/cart/change.js', 'POST', requestBody, null)

        this.items = response.data.items
        temporalUpdateBubbleCartCount(this.totalItems)
        this.isOpen = true
        this.error = null

        return handleResponseOrError(response, null);
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
        this.error = ERROR_MESSAGES.PRODUCT_NOT_IN_CART
      }
    },

    isProductInCart(id) {
      return this.items.find(item => item.id === Number(id))
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

function validateCartItem({ id, quantity }) {
  if (!id) {
    return ERROR_MESSAGES.INVALID_ID;
  }

  if (quantity && typeof quantity !== "number") {
    return ERROR_MESSAGES.INVALID_QUANTITY;
  }

  if (quantity > cartItemLimit) {
    return ERROR_MESSAGES.MAX_CART_ITEM_LIMIT_EXCEEDED;
  }

  return null;
}

function handleResponseOrError(response, error) {
  if (error) {
    return { error };
  } else {
    return { response };
  }
}

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
