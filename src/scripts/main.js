// import app from '../lib/init-theme'
import cart from '../lib/cart-logic'

import "../css/main.css";

document.addEventListener('DOMContentLoaded', () => {
  cart.init()
  // app.mountVue()
})

// if (Shopify.designMode) {
//   document.addEventListener("shopify:section:load", (event) => {
//     if (event.target.classList.value.includes("vue")) {
//       createVueApp().mount(event.target);
//     }
//   });
// } else if (!Shopify.designMode && process.env.NODE_ENV === "development") {
//   new MutationObserver((mutationsList) => {
//     mutationsList.forEach((record) => {
//       const vue = Array.from(record.addedNodes).find(
//         (node) => node.classList && node.classList.value.includes("vue")
//       );
//       if (vue) window.location.reload();
//     });
//   }).observe(document.body, {
//     childList: true,
//     subtree: true,
//   });
// }
