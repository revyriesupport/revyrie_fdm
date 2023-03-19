<script>
import { useCartStore } from "@store/cart-state";

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
    cardClasses: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const cart = useCartStore();

    const handleClick = (event) => {
      event.preventDefault();
      const id = props.product.variant_id;
      if (!id) return;

      const validateIfItemIsInCart = cart.items.find((item) => item.id === id);
      validateIfItemIsInCart
        ? cart.updateCartItem(id, validateIfItemIsInCart.quantity + 1)
        : cart.addToCart(id, 1);
    };

    return {
      cart,

      handleClick,
    };
  },
};
</script>
<template>
  <div class="snap-start shrink-0 w-96 flex items-start justify-center">
    <div
      class="w-full h-full mx-auto rounded-3xl shadow-xl overflow-hidden pb-2 border border-ink"
    >
      <div class="w-full h-full mx-auto flex flex-col">
        <div class="w-full">
          <div class="w-full aspect-video relative">
            <a
              :href="`/products/${product.handle}`"
              class="absolute inset-0 z-10"
              aria-label="View details for {{ product.title }}"
            ></a>
            <img
              :src="product.featured_image.url"
              :alt="product.featured_image.alt"
              class="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
        <div class="flex-1 flex flex-col p-4">
          <div class="flex-1 w-full">
            <p class="font-bold text-ink leading-7 mb-1">
              {{ product.title }}
            </p>
            <p class="text-accent1 mt-6">
              {{ product.product_description?.substring(0, 100) }}
            </p>
          </div>
          <button
            type="button"
            @click.prevent="handleClick"
            class="block mt-10 w-full px-4 py-3 bg-black font-medium text-center transition-colors duration-300 transform rounded-3xl focus:outline-none text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
