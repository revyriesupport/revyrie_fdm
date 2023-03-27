import { GraphQLClient } from 'graphql-request'
class Storefront {
  constructor() {
    this.client = new GraphQLClient(`https://${window.theme.storeData.domain}/api/graphql`, {
      headers: {
        "X-Shopify-Storefront-Access-Token": window.theme.storeData.storefrontToken
      }
    })
  }

  request(query, variables) {
    return this.client.request(query, variables)
  }
}

export default new Storefront()
