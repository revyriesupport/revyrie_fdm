<script>
import { ref, watch } from "vue";
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
  emits: ["decreaseQuantity", "updateQuantity", "increaseQuantity"],
  setup(props, context) {
    const quantity = ref(props.qty);
    watch(
      () => props.qty,
      (newQuantity) => {
        quantity.value = newQuantity;
        // context.refs.itemQuantity.focus();
      }
    );
    return {
      quantity,
    };
  },
};
</script>

<template>
  <button
    type="button"
    class="text-ink hover:text-accent2 py-3 px-1 transition duration-150 ease-in-out"
    aria-label="decrease quantity"
    @click="$emit('decreaseQuantity')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1"
      stroke="currentColor"
      class="w-10 h-10"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
    </svg>
  </button>
  <div class="w-16 text-center h-6" v-if="loading">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6 m-auto animate-spin"
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
    class="w-16 text-center text-ink bg-white border-ink focus:outline-none focus:ring-2"
    type="number"
    ref="itemQuantity"
    v-model="quantity"
    @change="$emit('updateQuantity')"
    min="1"
    aria-label="quantity"
  />
  <button
    type="button"
    class="text-ink hover:text-accent2 py-3 px-1 transition duration-150 ease-in-out"
    aria-label="increase quantity"
    @click="$emit('increaseQuantity')"
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
</template>
