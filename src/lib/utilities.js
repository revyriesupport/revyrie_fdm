/**
 * 
 * Start of Shopify Related Utilities
 * 
 */

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
 * Check if the current page is the cart page
 *
 * @returns {boolean}
 */
export function isCartPage() {
  return document.querySelector('.cart-page') !== null
}

/**
 * Check if the current page is the account page
 *
 * @returns {boolean}
 */
export function isAccountPage() {
  return document.querySelector('.account-page') !== null
}
/**
 * Convert Integer to currency format
 *
 * @returns {boolean}
 */
export function formatProductPrice(price, currencyCode = window.storeData.currencyCode) {
  const formatter = new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: currencyCode,
  });
  const formattedPrice = price / 100;
  return formatter.format(formattedPrice);
}

/**
 * 
 * End of Shopify Related Utilities
 * 
 */


/**
 * Generate a Fetch Request
 *
 * @param {string} url
 * @param {string} method
 * @param {object} body
 * @param {function} callback
 */
export async function generateFetchRequest(url, method, body, callback) {
  const requestOptions = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (method === 'POST' || method === 'PUT') {
    requestOptions.body = JSON.stringify(body)
  }

  const response = await fetch(url, requestOptions)
  const data = await response.json()

  if (callback) {
    callback(data)
  }

  return { data, response }
}

/**
 * Slugify a string
 *
 * @param {string} text
 */
export function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * takes a URL query string (e.g. "?foo=bar&baz=qux")
 * and returns an object representing the key-value 
 * pairs in the query string (e.g. { foo: "bar", baz: "qux" })
 * 
 * @param {string} queryString
 */
export function parseQueryString(queryString) {
  const params = {}
  queryString.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
    params[key] = decodeURIComponent(value)
  })
  return params
}

/**
 * Focus element by selector
 * 
 * @param {string} selector
 */
export function focusElement(selector) {
  const element = document.querySelector(selector)
  if (element) {
    element.focus()
  }
}
