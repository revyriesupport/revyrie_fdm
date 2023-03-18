<script>
import { defineAsyncComponent } from "vue";
import { useCartStore } from "@/vue/store/cart";
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
    class="fixed visible bottom-0 top-0 right-0 z-50 flex flex-col w-full max-w-lg lg:max-w-xl bg-white border-ink shadow-lg transition duration-300 ease-in-out"
    :class="{ 'translate-x-full': !cart.isOpen }"
    role="dialog"
    aria-modal="true"
    aria-labelledby="cartTitle"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 bg-white">
      <p class="text-xl font-medium text-ink" id="cartTitle">My Cart</p>
      <button
        type="button"
        id="close-mini-cart"
        class="text-ink focus-inset"
        aria-label="Close cart dialog"
        @click="cart.toggle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Announcement Bar -->
    <div class="p-4 bg-accent2">
      <p class="text-sm text-white" role="alert">
        Free shipping on orders over $50
      </p>
    </div>

    <!-- Cart Items -->
    <div
      v-if="cart.isEmpty"
      class="p-4 text-center flex-1 flex w-full items-center justify-center text-ink"
    >
      <p v-if="cart.isLoading" class="text-xl text-center">Loading...</p>
      <p v-else class="text-xl text-center">Your cart is empty.</p>
    </div>
    <div class="flex-1 overflow-auto" v-else>
      <cart-item
        v-for="item in cart.listItems"
        :key="item.id"
        :line="item"
        class="flex p-4 border-b border-gray-200 last:border-b-0"
      ></cart-item>
    </div>

    <!-- Footer -->
    <div
      class="flex items-center self-end w-full justify-between p-4 text-lg font-medium text-gray-800 bg-cream border-t border-ink/20"
    >
      <div class="w-full flex flex-col px-6 text-ink">
        <div class="mb-8">
          <label class="block text-gray-800 font-medium mb-2" for="notes"
            >Order Notes:</label
          >
          <textarea
            class="w-full border-ink/50 border py-2 px-3 m-0 focus:border-accent2 focus:ring-2 focus:ring-accent2 focus:ring-opacity-50 placeholder:text-sm"
            name="notes"
            rows="2"
            placeholder="Add notes about your order (optional)"
            aria-label="Order notes"
          ></textarea>
        </div>

        <div class="flex items-center justify-between mb-2 text-ink">
          <span>Subtotal:</span>
          <span class="text-ink" aria-live="polite">{{
            money(cart.subtotal)
          }}</span>
        </div>
        <div class="flex items-center justify-between mb-2 text-ink">
          <span class="text-ink">Taxes:</span>
          <span class="text-ink">{{ money(cart.taxes) }}</span>
        </div>
        <div class="flex items-center justify-between mb-2 text-ink">
          <span class="text-ink">Shipping:</span>
          <span class="text-ink">{{ money(cart.shipping) }}</span>
        </div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xl font-medium text-ink">Total:</span>
          <span class="text-xl font-medium text-ink">{{
            money(cart.total)
          }}</span>
        </div>

        <button
          @click="cart.checkout"
          type="button"
          class="w-full px-4 py-2 text-white bg-accent2 hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600 transition duration-150 ease-in-out"
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
