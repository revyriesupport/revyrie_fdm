<script>
import { computed } from "vue";
import { useGlobalStore } from "@store/global-state";
import { useCartStore } from "@store/cart-state";

export default {
  name: "shipping-progress-bar",
  setup() {
    const global = useGlobalStore();
    const cart = useCartStore();

    const progress = computed(() => {
      const cartTotal = parseFloat(cart.totalAmount);
      const threshold = global.shippingThreshold;
      return Math.min((cartTotal / threshold) * 100, 100);
    });

    const progressBarStyle = computed(() => {
      return {
        width: `${progress.value}%`,
      };
    });

    return {
      global,
      progress,
      progressBarStyle,
    };
  },
};
</script>

<template>
  <div v-if="global.showShippingProgressBar">
    <div v-if="progress < 100" class="p-4">
      <p class="text-sm" role="alert">
        {{ global.shippingProgressText }}
      </p>
      <div class="relative pt-1">
        <div class="mb-4 bg-grey flex h-2 overflow-hidden rounded bg-grey text-xs">
          <div
            :style="progressBarStyle"
            class="w-0 rounded-r-lg bg-black transition-all duration-500 ease-out"
          ></div>
        </div>
      </div>
    </div>
    <div v-else class="p-4">
      <p class="text-sm" role="alert">
        {{ global.shippingCompleteText }}
      </p>
    </div>
  </div>
</template>
