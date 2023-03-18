<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    // const productImages = ref([]);

    // const loadInitialProductImages = () => {
    //   const imagesJson = document.getElementById("product-images-json");
    //   if (imagesJson) {
    //     const images = JSON.parse(imagesJson.textContent);
    //     productImages.value = images.images;
    //   }
    // };

    // onMounted(loadInitialProductImages);

    // With store
    // const store = useStore();
    // const activeProductImages = computed(() => store.state.activeProductImages);
    const activeProductImages = [];

    return {
      activeProductImages,
      productImages,
    };
  },
};
</script>

<template>
  <div class="product-gallery">
    <slot>
      <img
        v-for="(image, index) in activeProductImages"
        :key="index"
        :src="image.src"
        :alt="image.alt"
      />
    </slot>
  </div>
</template>
