import { defineAsyncComponent, createApp } from "vue"
import { componentName } from './utilities'

class Init {
  constructor() {
    this.vueElements = document.querySelectorAll('[vue]')
  }

  mountVue() {
    this.vueElements.forEach(el => {
      this.requestComponent(el)
    })

    this.adminVueFix()
  }

  async requestComponent(el) {
    const app = createApp();
    const name = componentName(el.tagName.toLowerCase());

    const { default: definition } = await import(`../vue/components/render/${name}.vue`);
    app.component(name, definition);

    const parent = el.parentNode;
    const wrap = document.createElement('div');
    wrap.setAttribute('data-vue', name);

    parent.replaceChild(wrap, el);
    wrap.appendChild(el);

    app.mount(wrap);
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




/*
  mountVue() {
    this.vueElements.forEach(el => {
      const app = createApp();
      const name = componentName(el.tagName.toLowerCase())
      const components = import.meta.globEager("../vue/components/**-/*.vue");
      Object.entries(components).forEach(([path, definition]) => {
        const componentName = path
          .replace(/\/vue\/components/g, "")
          .replace(/\.(\/|vue|js)/g, "")
          .replace(/(\/|-|_|\s)\w/g, (match) => match.slice(1).toUpperCase())

        if (componentName == name) {
          app.component(componentName, definition.default);
        }
      });

      const parent = el.parentNode
      const wrap = document.createElement('div');
      wrap.setAttribute('data-vue', name)

      parent.replaceChild(wrap, el);
      wrap.appendChild(el);

      app.mount(wrap)
    })

    this.adminVueFix()
  }
*/

export default new Init()
