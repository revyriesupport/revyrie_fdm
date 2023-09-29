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
      formatProductPrice(line.value.final_line_price || 0)
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

  

    const currentVariantId = line.value.key.split(':')[0];

   



 
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
      variantimage: '',
      selectedVariantId: currentVariantId,
    };
  },
};
</script>

<template>
  
  
    <div class="mx-0 md:mx-8 cart-section-border" v-if = "!line.properties['_bundle_id']"> 
        <div
        class="w-full flex-grow overflow-y-auto py-6"
        :class="{ 'pointer-events-none animate-pulse': loading }"
      >
        <div class="grid grid-cols-3 display-grid cart-section">
          <div class="col-span-1">
            <div class="relative aspect-square w-full h-full">
              <a
                :href="line.url"
                class="absolute inset-0 z-10"
                aria-label="View details for {{ product.title }}"
              ></a>
              <img
                :src="line.image+'&width=500'"
                :alt="line.product_title + ' product image'"
                class="h-full w-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

          <div class="col-span-2">
            <div>
              <p v-if="line.product_type" class="text-ink/80 product-cart-typo body-font">
                {{ line.product_type }}
              </p>

              <Badge :productProperties="line.properties" />

              <h3 class="text-lg font-bold text-ink product-cart-typo body-font">{{ line.product_title }}</h3>
              <div class="flex items-center space-x-2 text-lg text-ink">
                <div
                  v-if="line.original_line_price != line.final_line_price"
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

              <!--<p
                class="flex gap-x-2 product-cart-typo body-font"
                v-for="option in line.options_with_values"
                :key="option.name"
              >
                <span v-text="`${option.name}:`" />
                <strong v-text="option.value"></strong>
              </p>-->
              <div class="variantlistbox">
              <p
                class="flex gap-x-2 product-cart-typo body-font"
                
              >
              <span v-for="option in line.options_with_values"
                :key="option.name" v-text="`${option.name}`" />
              </p> :

              <select @change="variantChange" class="variant__input" v-model="selectedVariantId"> 
                <option  v-for="variant in line.variant_data"   :value="variant.id" :data-aviliable="variant.available" >{{ variant.title }}</option> 
                
              </select>
              </div>
              <ul v-if="line.properties && Object.keys(line.properties).length > 0" class="cart_slide_properties">
                <li v-for="(value, key) in line.properties" :key="key">
                  <div
                    v-if="!key.startsWith('_')"
                    class="flex justify-start gap-x-2 text-sm text-ink/80"
                  >
                    <span>
                      <strong>{{ key }}:</strong>
                    </span>
                    <span>{{ value }}</span>
                    
                  </div>
                </li>
              </ul>
            </div>
            <div class="flex flex-col items-start">
              <div
                class="flex items-center space-x-2 border qty-handle-button"
                :class="{ 'pointer-events-none opacity-50': loading }"
              >
                <!-- v-model="line.quantity" -->
                <quantity
                  :qty="line.quantity"
                  :loading="loading"
                  @update-quantity="handleUpdateQuantity"
                  @increase-quantity="increaseQuantity"
                  @decrease-quantity="decreaseQuantity"
                ></quantity>
              </div>
              <!-- <button
                type="button"
                class="mt-2 text-sm underline underline-offset-4"
                aria-label="remove"
                @click="removeItem"
              >
                Remove
              </button> --> 
            </div>
            <p v-if="errorMessage" class="text-md mt-2 text-error">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>

  
</template>
