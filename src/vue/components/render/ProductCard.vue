<script>
import { useCartStore } from "@/vue/store/cart";

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
      const id = props.product.variants.edges[0].node.id;
      if (!id) return;

      const validateIfItemIsInCart = cart.items.find((item) => item.id === id);
      validateIfItemIsInCart
        ? cart.updateItem(id, validateIfItemIsInCart.quantity + 1)
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
      class="w-full mx-auto rounded-3xl shadow-xl overflow-hidden pb-2 border border-ink"
    >
      <div class="w-full mx-auto">
        <div class="w-full aspect-video relative">
          <a
            :href="`/products/${product.handle}`"
            class="absolute inset-0 z-10"
          ></a>
          <img
            :src="product.images.edges[0].node.src"
            :alt="product.images.edges[0].node.alt"
            class="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>
        <div class="p-4 sm:p-6">
          <p class="font-bold text-ink text-[22px] leading-7 mb-1">
            {{ product.title }}
          </p>
          <div class="flex flex-row">
            <p class="text-ink text-[17px] mr-2"></p>
          </div>
          <p class="text-accent1 font-[15px] mt-6">
            {{ product.description.substring(0, 100) }}
          </p>

          <button
            type="button"
            @click.prevent="handleClick"
            class="block mt-10 w-full px-4 py-3 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform rounded-[14px] focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-80 bg-accent1 hover:bg-accent1/90 text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
