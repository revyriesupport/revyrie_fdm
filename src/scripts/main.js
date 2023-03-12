import app from '../lib/init-theme'
import cart from '../lib/cart-logic'

import "../css/main.css";

document.addEventListener('DOMContentLoaded', () => {
  cart.init()
  app.mountVue()
})

