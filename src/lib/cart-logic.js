import { createApp, defineAsyncComponent } from "vue";
import { createPinia } from 'pinia'
import { useCartStore } from '../vue/store/cart'
import { loadMiniCartOnlyWhenIsOpen } from './store-definition'
import ProductSlider from '../vue/components/render/ProductSlider.vue'
import MiniCart from '../vue/components/render/MiniCart.vue'

class Cart {
  constructor() { }
  init() {
    const pinia = createPinia()
    const app = createApp(MiniCart)

    app.use(pinia)
    app.component('ProductSlider', ProductSlider)

    // app.component('CartItem', defineAsyncComponent(() =>
    //   import('../vue/components/render/CartItem.vue')
    // ))

    app.mount('#vue-cart')

    if (!loadMiniCartOnlyWhenIsOpen) {
      const cart = useCartStore()
      cart.fetchCart()
    }
  }
}

export default new Cart()

