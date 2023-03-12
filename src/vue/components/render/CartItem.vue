<script>
import { useCartStore } from "@/vue/store/cart";
import { formatProductPrice } from "@/lib/utilities";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const cart = useCartStore();
    const money = (priceValue) => formatProductPrice(priceValue);

    const updateQuantity = (data) => {
      console.log("updateQuantity", data);
    };
    const increaseQuantity = (data) => {
      console.log("increaseQuantity", data);
    };
    const decreaseQuantity = (data) => {
      console.log("decreaseQuantity", data);
    };
    const removeItem = (data) => {
      console.log("removeItem", data);
    };
    return {
      cart,

      money,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
    };
  },
};
</script>

<template>
  <div class="w-full flex-grow py-6 px-4 overflow-y-auto">
    <div class="flex flex-row gap-4 w-full">
      <div>
        <div class="w-full aspect-[2/3] relative">
          <a :href="item.url" class="absolute inset-0 z-10"></a>
          <img
            :src="item.image"
            :alt="item.product_title + ' product image'"
            class="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </div>

      <div class="flex flex-col w-full">
        <div class="mb-8">
          <p v-if="item.product_type" class="text-ink/80">
            {{ item.product_type }}
          </p>
          <p class="text-ink text-lg font-bold">{{ item.product_title }}</p>
          <div class="flex items-center space-x-2 text-lg font-bold text-ink">
            <div
              v-if="item.original_line_price != item.final_line_price"
              class="cart-item__discounted-prices"
            >
              <dl class="flex flex-row space-x-4">
                <dt class="sr-only">Regular price</dt>
                <dd>
                  <s class="text-gray-500 line-through">{{
                    money(item.original_line_price)
                  }}</s>
                </dd>
                <dt class="sr-only">Sale price</dt>
                <dd class="text-error">{{ money(item.final_line_price) }}</dd>
              </dl>
            </div>
            <div v-else class="text-gray-900">
              {{ money(item.original_line_price) }}
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2 border">
            <button
              type="button"
              class="text-ink hover:text-accent1 py-3 px-1 focus:outline-none focus:text-accent1 transition duration-150 ease-in-out"
              aria-label="decrease quantity"
              @click="decreaseQuantity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1"
                stroke="currentColor"
                class="w-10 h-10"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 12h-15"
                />
              </svg>
            </button>
            <input
              class="w-16 text-center text-ink bg-white border-ink rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent2"
              type="number"
              v-model="item.quantity"
              @change="updateQuantity"
              min="1"
            />
            <button
              type="button"
              class="text-ink hover:text-accent1 py-3 px-1 focus:outline-none focus:text-accent1 transition duration-150 ease-in-out"
              aria-label="increase quantity"
              @click="increaseQuantity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1"
                stroke="currentColor"
                class="w-10 h-10"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
          <div>
            <button
              type="button"
              class="text-red-500 hover:text-red-600 focus:outline-none focus:text-red-600"
              aria-label="remove"
              @click="removeItem"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
