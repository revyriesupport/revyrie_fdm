import cart from '@/lib/init-cart'
import app from '@/lib/init-theme'

import "../css/main.css";

document.addEventListener('DOMContentLoaded', () => {
  cart.init()
  app.mountVue()
})

