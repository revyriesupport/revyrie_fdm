import { createApp, defineComponent } from "vue";
import { createPinia } from 'pinia'
import ProductGallery from '@renderless/ProductGallery.vue';
import ProductHero from '@render/ProductHero.vue';

document.addEventListener('DOMContentLoaded', () => {
  const pinia = createPinia()
  const app = createApp(defineComponent({
    components: {
      ProductGallery,
      ProductHero,
    },
    data() {
      return {
        remainingMedia: window.remainingMedia || [],
      };
    },
  }));
  app.use(pinia)
  app.mount('#product-app')
});
