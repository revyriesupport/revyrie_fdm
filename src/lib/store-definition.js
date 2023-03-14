const config = {
  cartItemLimit: 3,
  loadMiniCartOnlyWhenIsOpen: true,
  miniCartRevertedOrder: true,
  sliderIntersectionOptions: {
    rootMargin: "10%",
    threshold: 0,
  }
}

export const storeConfig = config
export const cartItemLimit = storeConfig.cartItemLimit
export const loadMiniCartOnlyWhenIsOpen = storeConfig.loadMiniCartOnlyWhenIsOpen
export const miniCartRevertedOrder = storeConfig.miniCartRevertedOrder
export const sliderIntersectionOptions = storeConfig.sliderIntersectionOptions
