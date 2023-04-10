import {
  generateFetchRequest,
  calculateTotal,
} from '@/lib/utilities'

import { ERROR_MESSAGES } from '@/lib/error-messages.js';
import { cartItemLimit } from "@/lib/store-definition";

export function generateBodyObject({ id, key = false, quantity, properties, selling_plan }) {
  const res = { quantity }
  key
    ? res.key = key
    : res.id = id.toString();

  if (properties) {
    res.properties = properties;
  }
  if (selling_plan) {
    res.selling_plan = selling_plan;
  }
  return res
}


export async function applyDiscount(discountCode) {
  try {
    const response = await generateFetchRequest(
      `/discount/${discountCode}/apply.js`,
      'POST',
      null,
      null
    );
    return response.data.items;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function removeDiscount() {
  try {
    const response = await generateFetchRequest('/discount/remove.js', 'POST', null, null);
    return response.data.items;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function applyGiftCard(giftCardCode) {
  try {
    const response = await generateFetchRequest(
      `/gift_cards/${giftCardCode}/apply.js`,
      'POST',
      null,
      null
    );
    return response.data.items;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function removeGiftCard(giftCardId) {
  try {
    const response = await generateFetchRequest(
      `/gift_cards/${giftCardId}/remove.js`,
      'POST',
      null,
      null
    );
    return response.data.items;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export function hasDiscounts(items) {
  return items.some((item) => item.discount_applications?.length > 0) || false;
}

export function discountTotal(items) {
  return calculateTotal(items, (item) => item.final_line_price - item.original_line_price) || 0;
}

export function validateCartItem({ id, key, quantity }) {
  const id_or_key = id || key;
  if (!id_or_key) {
    return ERROR_MESSAGES.INVALID_ID;
  }

  if (quantity && typeof quantity !== "number") {
    return ERROR_MESSAGES.INVALID_QUANTITY;
  }

  if (quantity > cartItemLimit) {
    return ERROR_MESSAGES.MAX_CART_ITEM_LIMIT_EXCEEDED;
  }

  return null;
}

export function handleResponseOrError(response, error) {
  if (error) {
    return { error };
  } else {
    return { response };
  }
}