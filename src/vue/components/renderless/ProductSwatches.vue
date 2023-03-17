<script>
import { computed, ref } from "vue";

export default {
  props: {
    productOptions: {
      type: Array,
      default: () => [],
    },
    optionName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const productImages = ref([]);

    const swatches = computed(() => {
      const option = props.productOptions.find(
        (opt) => opt.name === props.optionName
      );
      if (!option) return [];

      return option.values.map((value) => ({
        name: value,
        image: productImages.value.find((image) => image.altText === value),
      }));
    });

    return {
      swatches,
      productImages,
    };
  },
};
</script>

<template>
  <div>
    <slot :swatches="swatches"></slot>
  </div>
</template>
