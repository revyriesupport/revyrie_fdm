<script>
import { useCartStore } from "@/vue/store/cart";
import CartItem from "./CartItem.vue";
import { formatProductPrice } from "@/lib/utilities";

export default {
  components: {
    CartItem,
  },
  setup() {
    const cart = useCartStore();
    const money = (priceValue) => formatProductPrice(priceValue);

    return {
      cart,

      money,
    };
  },
};
</script>
<template>
  <div
    class="fixed visible bottom-0 top-0 right-0 z-50 flex flex-col w-full max-w-md md:max-w-lg bg-white border-ink shadow-lg transition duration-300 ease-in-out"
    :class="{ 'translate-x-full': !cart.isOpen }"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between p-4 text-lg font-medium text-ink bg-white"
    >
      <span>My Cart</span>
      <button
        type="button"
        class="text-ink hover:text-ink focus:outline-none focus:text-ink"
        aria-label="close"
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
      <p class="text-sm text-white">Free shipping on orders over $50</p>
    </div>

    <!-- Cart Items -->
    <div v-if="cart.isEmpty" class="p-4 text-center">Your cart is empty.</div>
    <div v-else>
      <cart-item
        v-for="item in cart.items"
        :key="item.id"
        :item="item"
        class="flex p-4 border-b border-gray-200"
      ></cart-item>
    </div>

    <!-- Footer -->
    <div
      class="flex items-center self-end w-full justify-between p-4 text-lg font-medium text-gray-800 bg-gray-100"
    >
      <div class="w-full flex flex-col p-4 bg-gray-100">
        <div class="flex items-center justify-between mb-4">
          <span class="text-lg font-medium text-ink">Subtotal:</span>
          <span class="text-lg font-medium text-ink">{{
            money(cart.subtotal)
          }}</span>
        </div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-lg font-medium text-ink">Taxes:</span>
          <span class="text-lg font-medium text-ink">{{
            money(cart.taxes)
          }}</span>
        </div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-lg font-medium text-ink">Shipping:</span>
          <span class="text-lg font-medium text-ink">{{
            money(cart.shipping)
          }}</span>
        </div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-xl font-medium text-ink">Total:</span>
          <span class="text-xl font-medium text-ink">{{
            money(cart.total)
          }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-800 font-medium mb-2" for="notes"
            >Order Notes:</label
          >
          <textarea
            class="w-full rounded-lg border-gray-300 focus:border-accent2 focus:ring-2 focus:ring-accent2 focus:ring-opacity-50 placeholder:text-sm"
            id="notes"
            name="notes"
            rows="2"
            placeholder="Add notes about your order (optional)"
          ></textarea>
        </div>

        <button
          @click="cart.checkout"
          type="button"
          class="w-full px-4 py-2 text-white bg-accent2 rounded-md hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600 transition duration-150 ease-in-out mb-4"
        >
          Go to Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<!--
  <template>
  <div class="relative">
    <button
      @click="isCartOpen = !isCartOpen"
      class="p-2 text-ink hover:text-gray-700 focus:outline-none focus:text-gray-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        class="w-6 h-6"
      >
        <path
          fill="currentColor"
          d="M6 18a2 2 0 11-4 0 2 2 0 014 0zm12 0a2 2 0 11-4 0 2 2 0 014 0zm0-10v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8h16z"
        />
      </svg>

      <span class="ml-2 text-sm font-medium">
        {{ cart.totalItems }}
      </span>
    </button>

    <div
      v-if="isCartOpen"
      class="absolute right-0 z-10 w-64 mt-2 bg-white rounded-lg shadow-lg"
    >
      <div v-if="cart.isEmpty" class="p-4 text-center">Your cart is empty.</div>

      <div v-else>
        <div
          v-for="item in cart.items"
          :key="item.key"
          class="flex p-4 border-b border-gray-200"
        >
          Item {{ item }}
          <CartItem :item="item" />
        </div>

        <div class="flex p-4 bg-gray-100">
          <div class="flex-1 font-medium text-gray-900">Subtotal</div>
          <div class="font-medium text-gray-900">
            ${{ cart.subtotal.toFixed(2) }}
          </div>
        </div>

        <div class="flex justify-center p-4 pt-0">
          <button
            class="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="cart.checkout"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template> -->
