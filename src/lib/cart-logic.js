import { createApp } from "vue";
import { createPinia } from 'pinia'
import { useCartStore } from '../vue/store/cart'
import ProductSlider from '../vue/components/render/ProductSlider.vue'
import MiniCart from '../vue/components/render/MiniCart.vue'

class Cart {
  constructor() { }
  init() {
    const pinia = createPinia()
    const app = createApp(MiniCart)

    app.use(pinia)
    app.component('ProductSlider', ProductSlider)
    app.component('MiniCart', MiniCart)
    app.mount('#vue-cart')

    const cart = useCartStore()
    cart.fetchCart()
  }
}

export default new Cart()

