<script>
import { ref, computed, watchEffect } from "vue";
import { useCartStore } from "@store/cart-state";

import { formatProductPrice } from "@/lib/utilities";

import Quantity from "@render/Quantity.vue";
import Badge from "@render/Badge.vue";

export default {
  components: {
    Quantity,
    Badge,
  },
  props: {
    line: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const line = ref(props.line);
    console.log("___line:", line);

    watchEffect(() => {
      line.value = props.line;
    });

    const loading = ref(false);
    const cart = useCartStore();
    let errorMessage = ref(false);

    const finalPrice = computed(() =>
      formatProductPrice(line.value.final_line_price || 0)
    );

    const originalPrice = computed(() =>
      formatProductPrice(line.value.original_line_price || 0)
    );

    const requestUpdate = async (newQuantity) => {
      console.log("requestUpdate:", newQuantity);
      loading.value = true;

      const result = await cart.updateCartItem({
        id: line.value.id,
        quantity: newQuantity,
      });
      if (result.error) {
        errorMessage.value = result.error;
      }
      loading.value = false;
    };

    const handleUpdateQuantity = (qty) => {
      if (!Number.isInteger(qty)) return;
      requestUpdate(qty);
    };
    const increaseQuantity = () => requestUpdate(line.value.quantity + 1);
    const decreaseQuantity = () => requestUpdate(line.value.quantity - 1);

    const removeItem = () => {
      loading.value = true;
      requestUpdate(0);
    };

    return {
      line,
      cart,
      loading,
      errorMessage,
      finalPrice,
      originalPrice,

      handleUpdateQuantity,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
    };
  },
};
</script>

<template>
  <div
    class="w-full flex-grow overflow-y-auto py-6 px-4"
    :class="{ 'pointer-events-none animate-pulse': loading }"
  >
    <div class="flex flex-row gap-4">
      <div class="flex-1">
        <div class="relative aspect-square w-full">
          <a
            :href="line.url"
            class="absolute inset-0 z-10"
            aria-label="View details for {{ product.title }}"
          ></a>
          <img
            :src="line.image"
            :alt="line.product_title + ' product image'"
            class="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </div>

      <div class="flex flex-1 flex-col">
        <div class="mb-8">
          <p v-if="line.product_type" class="text-ink/80">
            {{ line.product_type }}
          </p>

          <Badge :productProperties="line.properties" />

          <h3 class="text-lg font-bold text-ink">{{ line.product_title }}</h3>
          <div class="flex items-center space-x-2 text-lg text-ink">
            <div
              v-if="line.original_line_price != line.final_line_price"
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
          <div
            v-if="line.properties && Object.keys(line.properties).length > 0"
          >
            <ul class="mt-2">
              <li
                v-for="(value, key) in line.properties"
                :key="key"
                class="flex justify-start gap-x-2 text-sm text-ink/80"
              >
                <span v-if="!key.startsWith('_')"
                  ><strong>{{ key }}:</strong></span
                >
                <span>{{ value }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div
            class="flex items-center space-x-2 border"
            :class="{ 'pointer-events-none opacity-50': loading }"
          >
            <!-- v-model="line.quantity" -->
            <quantity
              v-if="cart.isOpen"
              :qty="line.quantity"
              :loading="loading"
              @update-quantity="handleUpdateQuantity"
              @increase-quantity="increaseQuantity"
              @decrease-quantity="decreaseQuantity"
              @quantity-changed="onQuantityChanged"
            ></quantity>
          </div>
          <button
            type="button"
            class="mt-2 text-sm underline underline-offset-4"
            aria-label="remove"
            @click="removeItem"
          >
            Remove
          </button>
        </div>
        <p v-if="errorMessage" class="text-md mt-2 text-error">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>
