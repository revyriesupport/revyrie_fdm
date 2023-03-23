const config = {
  cartItemLimit: Number.MAX_SAFE_INTEGER,
  loadMiniCartOnlyWhenIsOpen: true,
  miniCartRevertedOrder: false,
  duplicateCartItemsBaseOnProperties: true,

  sliderIntersectionOptions: {
    rootMargin: "10%",
    threshold: 0,
  },
}

export const storeConfig = config
export const cartItemLimit = storeConfig.cartItemLimit
export const loadMiniCartOnlyWhenIsOpen = storeConfig.loadMiniCartOnlyWhenIsOpen
export const miniCartRevertedOrder = storeConfig.miniCartRevertedOrder
export const sliderIntersectionOptions = storeConfig.sliderIntersectionOptions
export const duplicateCartItemsBaseOnProperties = storeConfig.duplicateCartItemsBaseOnProperties
