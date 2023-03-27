<script>
import { defineAsyncComponent } from "vue";
import { useCartStore } from "@store/cart-state";
import CartItem from "./CartItem.vue";
import { formatProductPrice } from "@/lib/utilities";

// const CartItem = defineAsyncComponent(() =>
//   import("./CartItem.vue")
// );

export default {
  components: {
    CartItem,
  },
  setup() {
    const cart = useCartStore();
    const money = (priceValue) => formatProductPrice(priceValue);

    const headerCartIcon = document.getElementById("header-cart-icon");
    headerCartIcon.addEventListener("click", (event) => {
      event.preventDefault();
      cart.toggle();
    });

    // const CartItem = defineAsyncComponent(() => import("./CartItem.vue"));

    return {
      cart,

      money,
    };
  },
};
</script>
<template>
  <!-- max-w-md md:max-w-lg -->
  <div
    class="visible fixed bottom-0 top-0 right-0 z-50 flex w-full max-w-lg flex-col border-ink bg-white shadow-lg transition duration-300 ease-in-out lg:max-w-xl"
    :class="{ 'translate-x-full': !cart.isOpen }"
    role="dialog"
    aria-modal="true"
    aria-labelledby="cartTitle"
  >
    <!-- Header -->
    <div class="flex items-center justify-between bg-white p-4">
      <p class="text-xl font-medium text-ink" id="cartTitle">My Cart</p>
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

    <div class="bg-accent2 p-4">
      <p class="text-sm text-white" role="alert">
        Free shipping on orders over $50
      </p>
    </div>

    <div
      v-if="cart.isEmpty"
      class="flex w-full flex-1 items-center justify-center p-4 text-center text-ink"
    >
      <p v-if="cart.isLoading" class="text-center text-xl">Loading...</p>
      <p v-else class="text-center text-xl">Your cart is empty.</p>
    </div>
    <div class="flex-1 overflow-auto" v-else>
      <cart-item
        v-for="item in cart.listItems"
        :key="item.id"
        :line="item"
        class="border-gray-200 flex border-b p-4 last:border-b-0"
      ></cart-item>
    </div>

    <div
      class="text-gray-800 flex w-full items-center justify-between self-end border-t border-ink/20 bg-cream p-4 text-lg font-medium"
    >
      <div class="flex w-full flex-col px-6 text-ink">
        <!-- <div class="mb-8">
          <label class="text-gray-800 mb-2 block font-medium" for="notes"
            >Order Notes:</label
          >
          <textarea
            class="m-0 w-full border border-ink/50 py-2 px-3 placeholder:text-sm focus:border-accent2 focus:ring-2 focus:ring-accent2 focus:ring-opacity-50"
            name="notes"
            rows="2"
            placeholder="Add notes about your order (optional)"
            aria-label="Order notes"
          ></textarea>
        </div> -->

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
          class="hover:bg-yellow-600 focus:bg-yellow-600 w-full bg-accent2 px-4 py-2 text-white transition duration-150 ease-in-out focus:outline-none"
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
