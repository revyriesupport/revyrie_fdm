<script>
import { defineComponent, ref } from "vue";
import { slugify } from "@/lib/utilities";
import { useProductStore } from "@store/product-state";
import { useCartStore } from "@store/cart-state";

export default defineComponent({
  name: "product-hero",
  props: {
    shopifyData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { variant_id, options } = props.shopifyData;
    const product = useProductStore();
    const selectedOptions = ref({ Color: options[0].values[0] });
    let errorMessage = ref(false);

    function changeOption(value, option) {
      if (option.name === "Color") {
        product.setActiveColor(slugify(value));
      }
    }

    const handleClick = async (event) => {
      event.preventDefault();
      if (!variant_id) return;

      // properties: {}
      const cart = useCartStore();
      await cart
        .addToCart({
          id: variant_id,
          quantity: 1,
        })
        .then((res) => {
          console.log("res", res);
        })
    };

    return {
      product,
      errorMessage,
      selectedOptions,

      slugify,
      changeOption,
      handleClick,
    };
  },
});
</script>

<template>
  <div v-if="shopifyData">
    <div class="swatches-container">
      <div v-for="(option, index) in shopifyData.options" :key="index">
        <p>{{ option.name }}</p>
        <button
          v-for="(value, index) in option.values"
          :key="index"
          class="swatch mr-5 p-4"
          :class="[
            product.activeColor === slugify(value)
              ? 'bg-black text-white'
              : 'bg-grey',
          ]"
          @click="changeOption(value, option)"
        >
          {{ value }}
        </button>
      </div>
    </div>

    <p v-if="errorMessage" class="text-md mt-2 text-error">
      {{ errorMessage }}
    </p>

    <button
      type="button"
      @click.prevent="handleClick"
      class="mt-10 block w-full transform rounded-3xl bg-black px-4 py-3 text-center font-medium text-white transition-colors duration-300 focus:outline-none"
      v-text="window.variantStrings.addToCart"
    />
  </div>
</template>
