
import { createPinia } from 'pinia'
import { createApp } from "vue";
class Init {
  constructor() {
    this.vueElements = document.querySelectorAll('[vue]')
  }
  mountVueComponents() {

  }





  mountVue() {
    // console.log('mounting vue:')
    // const createVueApp = () => {
    //   const app = createApp({});

    //   const components = import.meta.globEager("../vue/components/**/*.vue");
    //   console.log('components:', components)
    //   Object.entries(components).forEach(([path, definition]) => {
    //     const componentName = path
    //       .replace(/\/vue\/components/g, "")
    //       .replace(/\.(\/|vue|js)/g, "")
    //       .replace(/(\/|-|_|\s)\w/g, (match) => match.slice(1).toUpperCase());

    //     app.component(componentName, definition.default);
    //   });

    //   const mixins = import.meta.globEager("../vue/mixins/*.js");
    //   Object.entries(mixins).forEach(([path, definition]) => {
    //     app.mixin(definition.default);
    //   });

    //   const directives = import.meta.globEager("../vue/directives/*.js");
    //   Object.entries(directives).forEach(([path, definition]) => {
    //     const directive = definition.default;
    //     app.directive(directive.name, directive.directive);
    //   });


    //   const pinia = createPinia()
    //   app.use(pinia);
    //   return app;
    // };

    // console.log('vueElements:', this.vueElements)
    // if (this.vueElements) this.vueElements.forEach(el => createVueApp().mount(el))
  }
}

export default new Init()

