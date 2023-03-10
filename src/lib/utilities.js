/**
 * Decode Storefront Product ID, this is used
 * with Storefront API
 *
 * @param {string} id
 */
export const decodeIDproduct = (id) => {
  return decodeURIComponent(escape(window.atob(id))).split(
    'gid://shopify/Product/'
  )[1]
}

/**
 * Encode from numerical to Storefront Product ID, this is used
 * with Storefront API
 *
 * @param {string} id
 */
export const encodeIDproduct = (id) => {
  return window.btoa('gid://shopify/Product/' + id)
}

/**
 * Decode Storefront Product Variant ID, this is used
 * with Storefront API
 *
 * @param {string} id
 */
export const decodeIDProductVariant = (id) => {
  return decodeURIComponent(escape(window.atob(id))).split(
    'gid://shopify/ProductVariant/'
  )[1]
}

/**
 * Clean Product ID
 *
 * @param {string} id
 */
export const cleanProductId = (id) => {
  return id.replace('gid://shopify/Product/', '')
}

/**
 * Clean Variant ID
 *
 * @param {string} id
 */
export const cleanProductVariantId = (id) => {
  return id.replace('gid://shopify/ProductVariant/', '')
}


/**
 * Generate a Fetch Request
 *
 * @param {string} url
 * @param {string} method
 * @param {object} data
 * @param {function} callback
 */

export const makeFetchRequest = ({ url, method, body = null, callback = null }) => {
  const requestOptions = {
    method: method,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === "POST" ? JSON.stringify(body) : null,
  };

  return fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => {
      callback(data)
    })
    .catch(error => {
      console.log('There was an error: ', error)
      return error
    });
}
