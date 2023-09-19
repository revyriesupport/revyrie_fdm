/**
 * 
 * Start of Shopify Related Utilities
 * 
 */

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
export function formatProductPrice(price, currencyCode = window.currencyCode) {
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

/**
 * Convert snake_case to componentName
 * (e.g. product_card => ProductCard)
 * 
 * @param {string} name
 */
export const componentName = (name) => {
  let camelCase = name.toLowerCase().replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );
  return camelCase[0].toUpperCase() + camelCase.slice(1);
}

/**
 * Return reduced value of an array
 *
 * @param {items} array
 * @param {function} callback
 */

export const calculateTotal = (items, callback) => {
  if (!items.length) return 0;
  return items.reduce((total, item) => total + callback(item), 0);
}


/**
 * 
 * Temporal Functions
 * 
 */

/**
 * Updates DOM Cart total item on header
 */
export const temporalUpdateBubbleCartCount = (count) => {
  if (!document.querySelector('.cart-count-bubble')) return
  count === 0
    ? document.querySelector('.cart-count-bubble').classList.add('hidden')
    : document.querySelector('.cart-count-bubble').classList.remove('hidden')
  document.querySelector('.cart-count-bubble span[aria-hidden="true"]').innerText = count
}
