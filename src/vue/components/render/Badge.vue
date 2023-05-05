<script>
import { computed } from "vue";

export default {
  props: {
    productTags: {
      type: Array,
      required: false,
      default: () => [],
    },
    productProperties: {
      type: Object,
      required: false,
      default: () => [],
    },
  },
  setup(props) {
    const badges = computed(() => {
      return props.productTags
        .filter((tag) => tag.startsWith("config:badge:"))
        .map((tag) => tag.split("config:badge:")[1]);
    });

    return { badges };
  },
};
</script>

<template>
  <div class="badges">
    <span v-for="badge in badges" :key="badge" class="badge">
      {{ badge }}
    </span>
  </div>
</template>
