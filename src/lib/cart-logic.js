import { createApp } from "vue";
import { createPinia } from 'pinia'
import { useCartStore } from '../vue/store/cart'
import ProductSlider from '../vue/components/render/ProductSlider.vue'

class Cart {
  constructor() {
  }
  init() {
    const pinia = createPinia()
    const app = createApp({})

    app.use(pinia)
    app.component('ProductSlider', ProductSlider)
    app.mount('#vue-cart')

    const cart = useCartStore()
    cart.getCart()
  }
}

export default new Cart()

