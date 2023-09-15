<script>
import { ref, watch, onMounted } from "vue";
import { useCartStore } from "@store/cart-state";
import { useGlobalStore } from "@store/global-state";

import { loadMiniCartOnlyWhenIsOpen } from "@/lib/store-definition";
import { formatProductPrice } from "@/lib/utilities";

import CartItem from "@render/CartItem.vue";
import ShippingProgressBar from "@render/ShippingProgressBar.vue";

export default {
  components: {
    CartItem,
    ShippingProgressBar,
  },
  setup() {
    const cart = useCartStore();
    const global = useGlobalStore();

    const note = ref(cart.note);
    const money = (priceValue) => formatProductPrice(priceValue);

    watch(
      () => cart.note,
      (newNote) => {
        note.value = newNote;
        cart.updateNote(newNote);
      }
    );

    if (!loadMiniCartOnlyWhenIsOpen) {
      cart.fetchCart();
    }

    onMounted(() => {
      global.setTemplate(document.body.dataset?.template || "");
      const headerCartIcon = document.getElementById("cart-icon-bubble");
      headerCartIcon.addEventListener("click", (event) => {
        event.preventDefault();
        if (global.template == "cart") return false;
        cart.toggle();
      });
    });

    return {
      cart,
      note,

      money,
    };
  },
};
</script>
<template>
  <div
    class="visible fixed bottom-0 top-0 right-0 z-50 flex w-full max-w-lg flex-col border-ink bg-white shadow-lg transition duration-300 ease-in-out lg:max-w-xl cart_drawer_slide"
    :class="{ 'translate-x-full': !cart.isOpen }"
    role="dialog"
    aria-modal="true"
    aria-labelledby="cartTitle"
  >
    <!-- Header -->
    <div class="flex items-center justify-between bg-white p-4 cart_drawer_header">
      <p class="text-xl font-medium text-ink" id="cartTitle">Perfect fit. Free returns within 30 days.</p>
      <button
        type="button"
        id="close-mini-cart"
        class="focus-inset text-ink"
        aria-label="Close cart dialog"
        @click="cart.toggle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <shipping-progress-bar></shipping-progress-bar>
    <div class="gift_lover_section">  
      <div class="gift_lover_left column-4">
        <a :href="cart.giftLoverImageLink"><img :src="cart.giftLoverImage" :alt="cart.giftLoverImageAlt"></a>
      </div> 
      <div class="gift_lover_right column-8">
        <h5>{{ cart.giftLoverTitle }}</h5>
        <p>{{ cart.giftLoverContent }}</p>
        <p>{{ cart.giftLoverNoteContent }}</p>
        <div class="variantsizebox">
          <p v-for="giftVariant in cart.variantsProduct">{{ money(giftVariant.price) }} {{ giftVariant.title }} Box</p>
        </div>
        <div class="product_size_box">
          <select id="select_size">
            <option v-for="giftVariant in cart.variantsProduct"  :value="giftVariant.id">{{ giftVariant.title }}</option>
          </select>  
          <div class="addcart_button">
            <form method="post" action="/cart/add" id="product-form-gift-lover" accept-charset="UTF-8" class="form" enctype="multipart/form-data" novalidate="novalidate" data-type="add-to-cart-form"><input type="hidden" name="form_type" value="product">
            <input type="hidden" name="utf8" value="✓">
            <input type="hidden" name="id" value="46838188605752" class="product-variant-id">
            <div class="product-form__buttons">
              <button id="ProductSubmitButton-gift-lover" type="submit" name="add" class="product-form__submit button button--full-width button--secondary" @click="cart.updateCartItemFetch"> 
            <span>Add to cart</span>
            <div class="loading-overlay__spinner hidden">
              <svg aria-hidden="true" focusable="false" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
              </svg>
            </div>
          </button>
          </div>
            </form>
           
          </div>
        </div>
        <div class="gift_lover_note">
        <p>{{ cart.giftLoverNote }} <a :href="cart.giftLoverNoteTextLink">{{cart.giftLoverNoteLinkText}}</a>.</p>
        </div>
      </div> 
    </div>
    <div
      v-if="cart.isEmpty"
      class="flex w-full flex-1 items-center justify-center p-4 text-center text-ink"
    >
      <p v-if="cart.isLoading" class="text-center text-xl">Loading...</p>
      <p v-else class="text-center text-xl">Your cart is empty.</p>
    </div>
    <div v-else class="flex-1 overflow-auto">
      <cart-item
        v-for="item in cart.listItems"
        :key="item.key"
        :line="item"
        class="border-gray-200 flex border-b p-4 last:border-b-0"
      ></cart-item>
    </div>

    <div
      class="text-gray-800 flex w-full items-center justify-between self-end border-t border-ink/20 bg-cream p-4 text-lg font-medium"
    >
      <div class="flex w-full flex-col px-6 text-ink">
        <div class="mb-8">
          <label class="text-gray-800 mb-2 block font-medium" for="note"
            >Order Note:</label
          >
          <textarea
            v-model="cart.note"
            class="m-0 w-full border border-ink/50 py-2 px-3 placeholder:text-sm focus:border-accent2 focus:ring-2 focus:ring-accent2 focus:ring-opacity-50"
            name="note"
            rows="2"
            placeholder="Add note about your order (optional)"
            aria-label="Order note"
          ></textarea>
        </div>

        <div class="mb-2 flex items-center justify-between text-ink">
          <span>Subtotal:</span>
          <span class="text-ink" aria-live="polite">{{
            money(cart.subtotal)
          }}</span>
        </div>
        <div class="mb-2 flex items-center justify-between text-ink">
          <span class="text-ink">Taxes:</span>
          <span class="text-ink">{{ money(cart.taxes) }}</span>
        </div>
        <div class="mb-2 flex items-center justify-between text-ink">
          <span class="text-ink">Shipping:</span>
          <span class="text-ink">{{ money(cart.shipping) }}</span>
        </div>
        <div class="mb-2 flex items-center justify-between">
          <span class="text-xl font-medium text-ink">Total:</span>
          <span class="text-xl font-medium text-ink">{{
            money(cart.total)
          }}</span>
        </div>

        <button
          @click="cart.checkout"
          type="button"
          class="bg-black text-white w-full px-4 py-2 transition duration-150 ease-in-out focus:outline-none"
          aria-label="Go to Checkout"
        >
          Go to Checkout
        </button>
      </div>
    </div>
  </div>
  <div
    aria-hidden="true"
    @click="cart.toggle"
    class="fixed inset-0 z-40 bg-black/50 opacity-0 transition duration-300 ease-in-out"
    :class="[
      { 'opacity-100': cart.isOpen },
      cart.isOpen ? 'pointer-events-auto' : 'pointer-events-none',
    ]"
  ></div>
</template>
