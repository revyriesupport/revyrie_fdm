<script>
import { ref, computed } from "vue";
import { useCartStore } from "@store/cart-state";

import ProductCard from "@render/ProductCard.vue";
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
      <div class="mt-8 w-full overflow-hidden" ref="productSlider">
        <div
          class="flex w-full snap-x snap-mandatory gap-4 overflow-auto"
          v-if="!loading"
        >
          <div
            class="h-100 flex w-96 shrink-0 snap-start items-center justify-center bg-grey"
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
            class="flex w-96 shrink-0 snap-start items-start justify-center"
          >
          </product-card>
        </div>
        <div class="flex w-full gap-4" v-else>
          <div
            v-for="n in 5"
            :key="n"
            class="flex w-96 shrink-0 snap-start items-start justify-center"
          >
            <div
              class="shadow-xl mx-auto w-full animate-pulse overflow-hidden rounded-3xl border border-ink pb-2"
            >
              <div class="w-full">
                <div class="relative h-52 w-full bg-grey"></div>
                <div class="mt-4 w-full px-4">
                  <div class="h-12 w-full bg-grey"></div>
                  <div class="mt-6 h-56 w-full bg-grey"></div>
                  <div class="mt-5 mb-4 h-12 w-full bg-grey"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </IntersectionObserver>
</template>
