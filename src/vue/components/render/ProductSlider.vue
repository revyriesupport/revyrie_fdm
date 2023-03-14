<script>
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "@/vue/store/cart";
import ProductCard from "./ProductCard.vue";
import useProductCollection from "@renderless/useProductCollection";

export default {
  components: {
    ProductCard,
  },
  props: {
    shopifyData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { collectionHandle, limit } = props.shopifyData;
    if (!collectionHandle) return;

    const { products, loading, fetchData } = useProductCollection(
      collectionHandle,
      limit
    );

    const cart = useCartStore();
    const productSlider = ref(null);

    onMounted(() => {
      const options = {
        rootMargin: "10%",
        threshold: 0,
      };

      const observer = new IntersectionObserver((entries, observer) => {
        if (entries[0].isIntersecting) {
          fetchData();
          observer.unobserve(productSlider.value);
        }
      }, options);

      observer.observe(productSlider.value);
    });

    const filteredProducts = computed(() => {
      // Perform filtering or transformation on the products array here
      return products.value;
    });

    return {
      cart,
      loading,
      filteredProducts,
      productSlider,
    };
  },
};
</script>

<template>
  <div class="w-full mt-8 overflow-hidden" ref="productSlider">
    <div
      class="w-full flex gap-4 snap-mandatory snap-x overflow-auto"
      v-if="!loading"
    >
      <product-card
        v-for="product in filteredProducts"
        :key="product.node.id"
        :product="product.node"
        class="snap-start shrink-0 w-96 flex items-start justify-center"
      >
      </product-card>
    </div>
    <div class="w-full flex gap-4" v-else>
      <div
        v-for="n in 5"
        :key="n"
        class="snap-start shrink-0 w-96 flex items-start justify-center"
      >
        <div
          class="w-full mx-auto rounded-3xl shadow-xl overflow-hidden pb-2 border border-ink animate-pulse"
        >
          <div class="w-full">
            <div class="w-full h-52 bg-grey relative"></div>
            <div class="w-full px-4 mt-4">
              <div class="w-full h-12 bg-grey"></div>
              <div class="w-full h-44 bg-grey mt-6"></div>
              <div class="w-full h-12 bg-grey mt-5 mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
