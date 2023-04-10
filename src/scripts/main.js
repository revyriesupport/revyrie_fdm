import Cart from '@/lib/init-cart'
import app from '@/lib/init-theme'

import "../css/main.css";

document.addEventListener('DOMContentLoaded', () => {
  console.log('Wop wop!')
  Cart.init()
  console.log('Cart mounted!')
  app.mountVue()
})
