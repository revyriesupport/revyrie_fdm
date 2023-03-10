export const collection = `
query collectionByHandle(
  $handle: String!
  $first: Int!
  ) {
  collectionByHandle(handle: $handle) {
    products(first: $first) {
      edges {
        cursor
        node {
          id
          title
          description
          handle
          images(first: 1) {
            edges {
              node {
                src
                altText
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                price
                compareAtPrice
                availableForSale
              }
            }
          }
        }
      }
    }
  }
}
`