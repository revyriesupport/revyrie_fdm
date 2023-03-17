<script>
import { ref, computed } from "vue";
import { useCartStore } from "@/vue/store/cart";
import ProductCard from "./ProductCard.vue";
import useProductCollection from "@renderless/useProductCollection";
import IntersectionObserver from "@renderless/IntersectionObserver.vue";

export default {
  components: {
    ProductCard,
    IntersectionObserver,
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

    const { products, loading, fetchData, fetchProduct } = useProductCollection(
      collectionHandle,
      limit
    );

    const cart = useCartStore();
    const productSlider = ref(null);

    const onEnterViewport = () => {
      fetchData();
    };
    const onLeaveViewport = () => {};

    const filteredProducts = computed(() => {
      return products.value;
    });

    return {
      cart,
      loading,
      filteredProducts,
      productSlider,

      onEnterViewport,
      onLeaveViewport,
      fetchProduct,
    };
  },
};
</script>

<template>
  <IntersectionObserver
    :unobserveOnEnter="true"
    @enterViewport="onEnterViewport"
    @leaveViewport="onLeaveViewport"
  >
    <div class="animated-section">
      <div class="w-full mt-8 overflow-hidden" ref="productSlider">
        <div
          class="w-full flex gap-4 snap-mandatory snap-x overflow-auto"
          v-if="!loading"
        >
          <div
            class="snap-start shrink-0 w-96 h-100 flex items-center justify-center bg-grey"
          >
            <button
              class="text-lg"
              type="button"
              @click="fetchProduct('striped-silk-blouse')"
            >
              Loading product
            </button>
          </div>
          <product-card
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
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
    </div>
  </IntersectionObserver>
</template>
