
// import { install } from 'esinstall'
// await install([ 'graphql-request', 'graphql' ], { polyfillNode : true })

import { GraphQLClient } from 'graphql-request'


// const test = ['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', '04f2fda2362ebacd8000b351d40f1102', '4b232b48283163b20081308fb458ec2a']

class Storefront {
  constructor () {
    this.client = new GraphQLClient(`https://${__GLOBAL__.domain}/api/2023-01/graphql`, {
      headers: {
        "X-Shopify-Storefront-Access-Token": __GLOBAL__.Storefront
      }
    })
  }

  request (query, variables) {
    return this.client.request(query, variables)
  }
}

export default new Storefront()
