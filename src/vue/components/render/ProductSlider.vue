<script>
import storefront from "@/lib/storefront";
import { collection as queryCollection } from "@/lib/queries";
import { ref } from "vue";
import { useCartStore } from "@/vue/store/cart";
import ProductCard from "./ProductCard.vue";

export default {
  components: {
    ProductCard,
  },
  props: {
    shopifyData: Object,
  },
  setup(props) {
    const { collectionHandle, tittle } = props.shopifyData;
    if (!collectionHandle) return;

    const cart = useCartStore();
    const loading = ref(true);
    const state = ref({
      products: [],
    });

    setTimeout(() => {
      storefront
        .request(queryCollection, { handle: collectionHandle, first: 10 })
        .then((response) => {
          if (!response.collectionByHandle) return;

          state.value.products = response.collectionByHandle.products.edges;
          loading.value = false;
        });
    }, 0);

    return {
      tittle,
      cart,
      loading,
      state,
    };
  },
};
</script>

<template>
  <div class="w-full mt-8">
    <div class="w-full flex gap-4 snap-mandatory snap-x overflow-auto">
      <template v-if="loading">
        <div
          v-for="n in 4"
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
      </template>

      <template v-else>
        <product-card
          v-for="product in state.products"
          :key="product.node.id"
          :product="product.node"
          class="snap-start shrink-0 w-96 flex items-start justify-center"
        >
        </product-card>
      </template>
    </div>
  </div>
</template>

<!-- 
<template>
<div class="flex-grow p-4">
  <h2 class="text-lg font-medium text-gray-800 mb-4">You May Also Like</h2>
  <div class="flex space-x-4 overflow-x-scroll overflow-y-hidden">

    <div class="flex-none w-48 bg-white rounded-lg shadow-md overflow-hidden">
      <img class="w-full h-32 object-cover" src="https://via.placeholder.com/150" alt="Product">
      <div class="p-4">
        <h3 class="text-base font-medium text-gray-800 mb-2">Product Name</h3>
        <p class="text-sm font-medium text-gray-500">Product Type</p>
        <p class="text-lg font-medium text-gray-800">$99.99</p>
        <button type="button" class="w-full mt-4 px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600 transition duration-150 ease-in-out">Add to Cart</button>
      </div>
    </div>


    <div class="flex-none w-48 bg-white rounded-lg shadow-md overflow-hidden">

    </div>


    <div class="flex-none w-48 bg-white rounded-lg shadow-md overflow-hidden">

    </div>
  </div>
</div>
</template>
 -->
