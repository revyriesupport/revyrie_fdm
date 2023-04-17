import { createApp } from "vue";
import { createPinia } from 'pinia'

document.addEventListener('DOMContentLoaded', () => {
  const pinia = createPinia()
  const app = createApp();
  app.use(pinia)
  app.mount('#product-app')
});
