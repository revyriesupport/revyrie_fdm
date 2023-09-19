
/**
 * Convert Product Storefront API response into a clearer format
 *
 * @param {object} product
 */
export const convertProductResponse = (product) => {
  const transformedProduct = {
    id: parseInt(product.id.split('/')[4]),
    variant_id: parseInt(product.variants.edges[0]?.node.id.split('/')[4]) || null,
    title: product.title,
    price: parseFloat(product.variants.edges[0]?.node.price) || 0,
    original_price: parseFloat(product.variants.edges[0]?.node.compareAtPrice) || 0,
    discounted_price: parseFloat(product.variants.edges[0]?.node.price) || 0,
    line_price: parseFloat(product.variants.edges[0]?.node.price) || 0,
    original_line_price: parseFloat(product.variants.edges[0]?.node.compareAtPrice) || 0,
    sku: product.variants.edges[0]?.node.sku || '',
    grams: product.variants.edges[0]?.node.weight || 0,
    product_id: parseInt(product.id.split('/')[4]),
    product_has_only_default_variant: product.variants.edges.length === 1,
    final_price: parseFloat(product.variants.edges[0]?.node.price) || 0,
    final_line_price: parseFloat(product.variants.edges[0]?.node.price) || 0,
    url: `/products/${product.handle}?variant=${parseInt(product.variants.edges[0]?.node.id.split('/')[4])}`,
    featured_image: {
      alt: product.title,
      url: product.images.edges[0]?.node.src || '',
    },
    image: product.images.edges[0]?.node.src || '',
    handle: product.handle,
    product_type: product.productType,
    product_title: product.title,
    product_description: product.description,
    tags: product.tags,
    variant_title: product.variants.edges[0]?.node.title || '',
    variant_options: product.variants.edges[0]?.node.selectedOptions.map(option => option.value) || [],
    options_with_values: product.options.map(option => {
      return {
        name: option.name,
        value: product.variants.edges[0]?.node.selectedOptions.find(selectedOption => selectedOption.name === option.name).value || ''
      };
    }),
  };

  return transformedProduct;
}


/**
 * Convert Collection Storefront API response into a clearer format
 *
 * @param {object} product
 */

export const convertCollectionResponse = (collection) => {
  const transformedCollection = {
    id: collection.id ? parseInt(collection.id.split('/')[4]) : null,
    title: collection.title || '',
    handle: collection.handle || '',
    description: collection.description || '',
    products: collection.products?.edges?.map(edge => {
      const product = edge.node;
      return convertProductResponse(product);
    }) || [],
  };

  return transformedCollection;
}

/**
 * Clean Variant ID
 *
 * @param {string} id
 */
export const cleanProductVariantId = (id) => {
  return Number(id.replace('gid://shopify/ProductVariant/', ''))
}
