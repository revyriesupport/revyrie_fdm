<script>
import storefront from "@/lib/storefront";
import { collection as queryCollection } from "@/lib/queries";
import { ref } from "vue";
import { useCartStore } from "@/vue/store/cart";

export default {
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
    }, 5000);

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
    <p class="text-2xl mb-8">Items on Cart: {{ cart.lineItemsCount }}</p>

    <p class="text-2xl mb-8">{{ tittle }}</p>

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
        <div
          v-for="product in state.products"
          :key="product.node.id"
          class="snap-start shrink-0 w-96 flex items-start justify-center"
        >
          <div
            class="w-full mx-auto rounded-3xl shadow-xl overflow-hidden pb-2 border border-ink"
          >
            <div class="w-full mx-auto">
              <div class="w-full aspect-video relative">
                <a
                  :href="`/products/${product.node.handle}`"
                  class="absolute inset-0 z-10"
                ></a>
                <img
                  :src="product.node.images.edges[0].node.src"
                  :alt="product.node.images.edges[0].node.alt"
                  class="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              <div class="p-4 sm:p-6">
                <p class="font-bold text-ink text-[22px] leading-7 mb-1">
                  {{ product.node.title }}
                </p>
                <div class="flex flex-row">
                  <p class="text-ink text-[17px] mr-2"></p>
                </div>
                <p class="text-accent1 font-[15px] mt-6">
                  {{ product.node.description.substring(0, 100) }}
                </p>

                <button
                  type="button"
                  @click.prevent="
                    cart.addToCart({
                      id: product.node.variants.edges[0].node.id,
                      quantity: 1,
                    })
                  "
                  class="block mt-10 w-full px-4 py-3 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform rounded-[14px] focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-80 bg-accent1 hover:bg-accent1/90 text-white"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
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
