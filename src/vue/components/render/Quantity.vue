<script>
import { ref, watchEffect } from "vue";
export default {
  props: {
    qty: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["update-quantity", "increase-quantity", "decrease-quantity"],
  setup(props, context) {
    const quantity = ref(props.qty);

    watchEffect(() => {
      quantity.value = props.qty;
    });

    const handleUpdateQuantity = () => {
      context.emit("update-quantity", quantity.value);
    };

    const handleIncreaseQuantity = () => {
      context.emit("increase-quantity");
    };

    const handleDecreaseQuantity = () => {
      context.emit("decrease-quantity");
    };

    return {
      quantity,

      handleUpdateQuantity,
      handleIncreaseQuantity,
      handleDecreaseQuantity,
    };
  },
};
</script>

<template>
  <button
    type="button"
    class="py-3 px-1 text-ink transition duration-150 ease-in-out hover:text-accent2"
    aria-label="decrease quantity"
    @click="handleDecreaseQuantity(quantity)"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1"
      stroke="currentColor"
      class="h-10 w-10"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
    </svg>
  </button>
  <div class="h-6 w-16 text-center" v-if="loading">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="m-auto h-6 w-6 animate-spin"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
      />
    </svg>
  </div>
  <input
    v-else
    class="w-16 border-ink bg-white text-center text-ink focus:outline-none focus:ring-2"
    type="number"
    ref="itemQuantity"
    v-model="quantity"
    @change="handleUpdateQuantity(quantity)"
    min="1"
    aria-label="quantity"
  />
  <button
    type="button"
    class="py-3 px-1 text-ink transition duration-150 ease-in-out hover:text-accent2"
    aria-label="increase quantity"
    @click="handleIncreaseQuantity(quantity)"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1"
      stroke="currentColor"
      class="h-10 w-10"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  </button>
</template>
