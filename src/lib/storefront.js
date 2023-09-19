import { GraphQLClient } from 'graphql-request'
class Storefront {
  constructor() {
    this.client = new GraphQLClient(`https://${window.storeData.domain}/api/graphql`, {
      headers: {
        "X-Shopify-Storefront-Access-Token": window.storeData.storefrontToken
      }
    })
  }

  async request(query, variables) {
    try {
      const response = await this.client.request(query, variables);
      return response;
    } catch (error) {
      console.error('There was an error with Storefront API', error.response.error)
      throw error;
    }
  }
}

export default new Storefront()
