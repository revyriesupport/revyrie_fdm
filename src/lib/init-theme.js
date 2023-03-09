import {
  collectionQuery, 
  shop as queryShop,
  products as queryProducts,
  product as queryProduct,
} from './queries'
import storefront from './storefront'

class Init {
  constructor () {}

  init () {
    // storefront.request(queryShop, { handle: 'home-page-slider' })
    // .then((response) => {
    //   console.log('Response', response)
    // })
  }
}

export default new Init()

