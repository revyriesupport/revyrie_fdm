import { defineAsyncComponent, createApp } from "vue"
import { createPinia } from 'pinia'
import { componentName } from './utilities'

class Init {
  constructor() {
    this.vueElements = document.querySelectorAll('[vue]')
  }

  mountVue() {
    this.vueElements.forEach(el => {
      // const pinia = createPinia()

      const app = createApp();
      const name = componentName(el.tagName.toLowerCase())
      const components = import.meta.globEager("../vue/components/**/*.vue");
      Object.entries(components).forEach(([path, definition]) => {
        const componentName = path
          .replace(/\/vue\/components/g, "")
          .replace(/\.(\/|vue|js)/g, "")
          .replace(/(\/|-|_|\s)\w/g, (match) => match.slice(1).toUpperCase())
          .replace('.renderless', '')
          .replace('.render', '');

        if (componentName == name) {
          app.component(componentName, definition.default);
        }
      });

      const parent = el.parentNode
      const wrap = document.createElement('div');
      wrap.setAttribute('data-vue-parent', name)

      parent.replaceChild(wrap, el);
      wrap.appendChild(el);

      // app.use(pinia)

      app.mount(wrap)
    })

    this.adminVueFix()
  }
  adminVueFix() {
    if (window.Shopify.designMode) {
      document.addEventListener("shopify:section:load", (event) => {
        if (event.target.classList.value.includes("vue")) {
          createVueApp().mount(event.target);
        }
      });
    } else if (!window.Shopify.designMode && process.env.NODE_ENV === "development") {
      new MutationObserver((mutationsList) => {
        mutationsList.forEach((record) => {
          const vue = Array.from(record.addedNodes).find(
            (node) => node.classList && node.classList.value.includes("vue")
          );
          if (vue) window.location.reload();
        });
      }).observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }
}

export default new Init()

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
// };
