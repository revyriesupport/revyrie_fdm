<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const productImages = ref([]);

    const loadInitialProductImages = () => {
      const imagesJson = document.getElementById("product-images-json");
      if (imagesJson) {
        const images = JSON.parse(imagesJson.textContent);
        productImages.value = images.images;
      }
    };

    onMounted(loadInitialProductImages);

    return {
      productImages,
    };
  },
};
</script>

<template>
  <div></div>
</template>
