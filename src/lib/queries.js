
const productPresentmentPricing = `
presentmentPriceRanges (first: 5, presentmentCurrencies: [USD]) {
  edges {
    node {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
}`

export const collectionQuery = `
query collectionByHandle(
  $handle: String!
  $first: Int!
  ) {
  shop {
    collectionByHandle(handle: $handle) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            productType
            publishedAt
            ${productPresentmentPricing}
            priceRange {
              minVariantPrice {
                amount
              }
              maxVariantPrice {
                amount
              }
            }
            tags
            images(first: 30, maxWidth: 650) {
              edges {
                node {
                  src
                  altText
                  originalSrc
                }
              }
            }
            options {
              id
              name
              values
            }
          }
        }
      }
    }
  }
}
`

export const shop = `
query shop {
  {
    shop {
      name
    }
  }
}
`
export const product = `
{
  products(query:"id:8086349545761" first:1 ) {
    edges {
      node {
        variants(first:100) {
          edges {
            node {
              title
              id
            }
          }
        }
      }
    }
  } 
}
`
export const products = `
{
  products(first: 3) {
    edges {
      node {
        id
        title
      }
    }
  }
}
`