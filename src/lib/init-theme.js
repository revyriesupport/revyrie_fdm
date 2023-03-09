import {
  collectionQuery, 
  shop as queryShop,
  products as queryProducts,
  product as queryProduct,
} from './queries'
import storefront from './storefront'

import { useCartStore } from '../vue/store/cart'
import { createPinia } from 'pinia'
import { createApp } from "vue";
class Init {
  constructor () {
  }
  mountVue () {
    const createVueApp = () => {
      const app = createApp({});

      const components = import.meta.globEager("./vue/components/**/*.vue");
      console.log('components:', components)
      Object.entries(components).forEach(([path, definition]) => {
        const componentName = path
          .replace(/\/vue\/components/g, "")
          .replace(/\.(\/|vue|js)/g, "")
          .replace(/(\/|-|_|\s)\w/g, (match) => match.slice(1).toUpperCase());

        app.component(componentName, definition.default);
      });

      const mixins = import.meta.globEager("./vue/mixins/*.js");
      Object.entries(mixins).forEach(([path, definition]) => {
        app.mixin(definition.default);
      });

      const directives = import.meta.globEager("./vue/directives/*.js");
      Object.entries(directives).forEach(([path, definition]) => {
        const directive = definition.default;
        app.directive(directive.name, directive.directive);
      });


      const pinia = createPinia()
      app.use(pinia);
      return app;
    };
    
    const vueElements = document.querySelectorAll("[vue]");
    console.log('>>>vueElements:', vueElements)
    if (vueElements) vueElements.forEach((el) => {
      console.log('Mounting Vue')
      createVueApp().mount(el)
    });
  }
  init () {
    const cart = useCartStore()
    const { cartCreate } = cart 

    cartCreate(window.storeData.cart)
    // storefront.request(queryShop, { handle: 'home-page-slider' })
    // .then((response) => {
    //   console.log('Response', response)
    // })
  }
}

export default new Init()

