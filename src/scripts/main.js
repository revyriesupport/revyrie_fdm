import Cart from '@/lib/init-cart'
import App from '@/lib/init-theme'

import "../css/main.css";

document.addEventListener('DOMContentLoaded', () => {
  Cart.init()
  App.mountVue()
})
