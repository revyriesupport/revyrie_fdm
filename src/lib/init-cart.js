import { createApp } from "vue";
import { createPinia } from 'pinia'
import ProductSlider from '../vue/components/render/ProductSlider.vue'
import MiniCart from '@render/MiniCart.vue'

class Cart {
  constructor() { }
  init() {
    const pinia = createPinia()
    const app = createApp(MiniCart)

    app.use(pinia)
    app.component('ProductSlider', ProductSlider)
    app.mount('#mini-cart')
  }
}

export default new Cart()
