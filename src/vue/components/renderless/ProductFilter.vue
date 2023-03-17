<script>
import { computed } from "vue";

export default {
  props: {
    products: {
      type: Array,
      default: () => [],
    },
    filterCriteria: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const filteredProducts = computed(() => {
      // Logic for Options, Tags, Product TypeError, Even Metafields
      if (props.filterCriteria.productType) {
        return props.products.filter(
          (product) => product.product_type === props.filterCriteria.productType
        );
      }

      return props.products;
    });

    return {
      filteredProducts,
    };
  },
};
</script>

<template>
  <div>
    <slot :filteredProducts="filteredProducts"></slot>
  </div>
</template>
