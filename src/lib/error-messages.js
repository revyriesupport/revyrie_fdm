
import { cartItemLimit } from "@/lib/store-definition";

export const ERROR_MESSAGES = {
  INVALID_ID: "Invalid item ID",
  INVALID_QUANTITY: "Invalid quantity",
  PRODUCT_NOT_IN_CART: "Product not in cart",
  MAX_CART_ITEM_LIMIT_EXCEEDED: `You can not add more than ${cartItemLimit} items`,
};