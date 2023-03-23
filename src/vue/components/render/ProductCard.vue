<script>
import { useCartStore } from "@store/cart-state";
import { ref, computed } from "vue";

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
    let errorMessage = ref(false);

    const truncatedDescription = computed(() =>
      props.product.product_description?.substring(0, 100)
    );

    const handleClick = async (event) => {
      event.preventDefault();
      const id = props.product.variant_id;
      if (!id) return;

      // const validateIfItemIsInCart = cart.items.find((item) => item.id === id);
      // validateIfItemIsInCart
      //   ? cart.updateCartItem({ id, quantity: validateIfItemIsInCart.quantity + 1 })
      //   : cart.addToCart({ id, quantity: 1 });

      const result = await cart.addToCart({
        id,
        quantity: 1,
        properties: { ink: "red" },
      });

      if (result.error) {
        errorMessage.value = result.error;
      }
    };

    return {
      cart,
      errorMessage,
      truncatedDescription,

      handleClick,
    };
  },
};
</script>
<template>
  <div class="flex w-96 shrink-0 snap-start items-start justify-center">
    <div
      class="shadow-xl mx-auto h-full w-full overflow-hidden rounded-3xl border border-ink pb-2"
    >
      <div class="mx-auto flex h-full w-full flex-col">
        <div class="w-full">
          <div class="relative aspect-video w-full">
            <a
              :href="`/products/${product.handle}`"
              class="absolute inset-0 z-10"
              aria-label="View details for {{ product.title }}"
            ></a>
            <img
              v-if="product.featured_image.url"
              :src="product.featured_image.url"
              :alt="product.featured_image.alt"
              class="h-full w-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
        <div class="flex flex-1 flex-col p-4">
          <div class="w-full flex-1">
            <p class="mb-1 font-bold leading-7 text-ink">
              {{ product.title }}
            </p>
            <p class="mt-6 text-accent1">{{ truncatedDescription }}</p>
          </div>

          <p v-if="errorMessage" class="text-md mt-2 text-error">
            {{ errorMessage }}
          </p>
          <button
            type="button"
            @click.prevent="handleClick"
            class="mt-10 block w-full transform rounded-3xl bg-black px-4 py-3 text-center font-medium text-white transition-colors duration-300 focus:outline-none"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
