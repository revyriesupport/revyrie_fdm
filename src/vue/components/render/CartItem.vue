<script>
import { ref, computed } from "vue";
import { useCartStore } from "@store/cart-state";
import { formatProductPrice } from "@/lib/utilities";
import { cartItemLimit } from "@/lib/store-definition";
import Quantity from "./Quantity.vue";

export default {
  components: {
    Quantity,
  },
  props: {
    line: {
      type: Object,
      required: true,
    },
  },
  setup({ line }) {
    const loading = ref(false);
    const item = ref({ ...line });
    const cart = useCartStore();
    let errorMessage = ref(false);

    const finalPrice = computed(() =>
      formatProductPrice(item.value.final_line_price)
    );
    const originalPrice = computed(() =>
      formatProductPrice(item.value.original_line_price)
    );

    const requestUpdate = (newQuantity) => {
      if (newQuantity <= cartItemLimit) {
        errorMessage.value = false;
        loading.value = true;

        cart.updateCartItem(item.value.id, newQuantity, (res) => {
          const { data, response } = res;
          if (response.status === 200) {
            const newItem = data.items.find(
              (edge) => edge.id === item.value.id
            );
            item.value = newItem;
          } else {
            errorMessage.value = response.statusText;
          }
          loading.value = false;
        });
      } else {
        errorMessage.value = `You can only add ${cartItemLimit} items to your cart`;
      }
    };

    const updateQuantity = (qty) => {
      if (!Number.isInteger(qty)) return;
      requestUpdate(qty);
    };

    const increaseQuantity = () => requestUpdate(item.value.quantity + 1);
    const decreaseQuantity = () => requestUpdate(item.value.quantity - 1);
    const removeItem = () => requestUpdate(0);

    return {
      item,
      cart,
      loading,
      errorMessage,
      finalPrice,
      originalPrice,

      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
    };
  },
};
</script>

<template>
  <div
    class="w-full flex-grow py-6 px-4 overflow-y-auto"
    :class="{ 'pointer-events-none animate-pulse': loading }"
  >
    <div class="flex flex-row gap-4">
      <div class="flex-1">
        <div class="w-full aspect-square relative">
          <a
            :href="item.url"
            class="absolute inset-0 z-10"
            aria-label="View details for {{ product.title }}"
          ></a>
          <img
            :src="item.image"
            :alt="item.product_title + ' product image'"
            class="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </div>

      <div class="flex flex-col flex-1">
        <div class="mb-8">
          <p v-if="item.product_type" class="text-ink/80">
            {{ item.product_type }}
          </p>
          <h3 class="text-ink text-lg font-bold">{{ item.product_title }}</h3>
          <div class="flex items-center space-x-2 text-lg text-ink">
            <div
              v-if="item.original_line_price != item.final_line_price"
              class="cart-item__discounted-prices"
            >
              <dl class="flex flex-row space-x-4">
                <dt class="sr-only">Regular price</dt>
                <dd>
                  <s class="text-gray-500 line-through">{{ originalPrice }}</s>
                </dd>
                <dt class="sr-only">Sale price</dt>
                <dd class="text-error">{{ finalPrice }}</dd>
              </dl>
            </div>
            <div v-else class="text-gray-900">
              {{ originalPrice }}
            </div>
          </div>
          <p></p>
        </div>
        <div class="flex flex-col items-end">
          <div
            class="flex items-center space-x-2 border"
            :class="{ 'pointer-events-none opacity-50': loading }"
          >
            <quantity
              v-if="cart.isOpen"
              :decreaseQuantity="decreaseQuantity"
              :updateQuantity="updateQuantity"
              :increaseQuantity="increaseQuantity"
              :qty="item.quantity"
              :loading="loading"
            ></quantity>
          </div>
          <div>
            <button
              type="button"
              class="text-sm underline underline-offset-4 mt-2"
              aria-label="remove"
              @click="removeItem"
            >
              Remove
            </button>
          </div>
        </div>
        <p v-if="errorMessage" class="text-error text-md mt-2">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>
