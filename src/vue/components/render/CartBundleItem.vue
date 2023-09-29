<script>
import { ref, computed, watchEffect, onMounted } from "vue";
import { useCartStore } from "@store/cart-state";

import { formatProductPrice } from "@/lib/utilities";

import Quantity from "@render/Quantity.vue";
import Badge from "@render/Badge.vue";

export default {
  components: {
    Quantity,
    Badge,
  },
  props: {
    line: {
      type: Object,
      required: true,
    },
  },
  setup(props) {

    const line = ref(props.line);

    watchEffect(() => {
      line.value = props.line;
    });

    const loading = ref(false);
    let errorMessage = ref(false);

    const finalPrice = computed(() =>
      formatProductPrice(line.value.price || 0)
    );

    const originalPrice = computed(() =>
      formatProductPrice(line.value.original_line_price || 0)
    );

    const cart = useCartStore();

    const requestUpdate = async (newQuantity) => {
      loading.value = true;

      const result = await cart.updateCartItem({
        key: line.value.key,
        quantity: newQuantity,
      });
      if (result.error) {
        errorMessage.value = result.error;
      }
      loading.value = false;
    };

    const handleUpdateQuantity = (qty) => {
      if (!Number.isInteger(qty)) return;
      requestUpdate(qty);
    };
    const increaseQuantity = () => requestUpdate(line.value.quantity + 1);
    const decreaseQuantity = () => requestUpdate(line.value.quantity - 1);

    const removeItem = () => requestUpdate(0);

    const variantChange = async (event) => {
      var variantId = event.target.value;
      loading.value = true;
      const result = await cart.updateCartItem({
        key: variantId,
        quantity: 1,
      });
      requestUpdate(0);
    };

  
    const removeBundleItem = async (event) => {
     window.theme.removeBundle(line.value.remove_data);
    };

    return {
      line,
      loading,
      errorMessage,
      finalPrice,
      originalPrice,

      handleUpdateQuantity,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      variantChange,
      removeBundleItem,
    };
  },
};
</script>

<template>
  
  
    <div class="mx-0 md:mx-8 cart-section-border cart_slide_bundle_box"> 
      <div
        class="w-full flex-grow overflow-y-auto py-6"
        :class="{ 'pointer-events-none animate-pulse': loading }"
      >
        <div class="grid grid-cols-3 display-grid cart-section">
        <div class="col-span-1">
          <div class="relative aspect-square w-full h-full">
              
              <img
                :src="line.bundle_image+'&width=500'"
                :alt="line.title + ' product image'"
                class="h-full w-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

          <div class="col-span-2">
            <div>
              <h3 class="text-lg font-bold text-ink product-cart-typo body-font">{{ line.title }}</h3>
              <p class="cartline_item_msg" v-if="line.sale_count > 1">{{ line.sale_count }} items in your bundle are final sale</p>
              <p class="cartline_item_msg" v-else-if="line.sale_count == 1">{{ line.sale_count }} item in your bundle are final sale.</p>
              <div class="flex items-center space-x-2 text-lg text-ink cart_side_price">
                <div
                  v-if="line.original_line_price != line.price"
                  class="cart-item__discounted-prices"
                >
                  <dl class="flex flex-row space-x-4">
                    <dt class="sr-only">Regular price</dt>
                    <dd>
                      <s class="text-gray-500 line-through">{{ originalPrice }}</s>
                    </dd>
                    <dt class="sr-only">Sale price</dt>
                    <dd class="text-error">{{ finalPrice }}</dd>
                  </dl>
                </div>
                <div v-else class="text-gray-900 product-cart-typo body-font font-bold-600">
                  {{ originalPrice }}
                </div>
              </div>

              <div class="cart_slide_remove_box">
                <a v-bind:href="'/collections/build-your-bundle?edit-bundle=' + line.update_data" class="cartslide_edit">Edit</a>
                <a href="javascript:void(0);" @click="removeBundleItem" :data-ids="line.remove_data" class="cartslide_remove">Remove</a> 
              </div> 
            </div>
            </div>
          </div>
        </div>

    </div>

  
</template>
