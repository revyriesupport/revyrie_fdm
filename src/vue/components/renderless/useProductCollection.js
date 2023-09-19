import { ref } from "vue";
import storefront from "@/lib/storefront";
import { convertProductResponse, convertCollectionResponse } from "@/lib/utilities-graphql";
import { collection as queryCollection } from "@/lib/queries";
import { product as queryProduct } from "@/lib/queries";

export default function useProductCollection(collectionHandle, limit = 10) {
  const products = ref([]);
  const loading = ref(true);

  const fetchData = async () => {
    try {
      const response = await storefront.request(queryCollection, {
        handle: collectionHandle,
        productsFirst: parseInt(limit),
      });
      if (!response.collectionByHandle) return;

      const collection = convertCollectionResponse(response.collectionByHandle)
      products.value = collection.products
      loading.value = false;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProduct = async (handle) => {
    try {
      const response = await storefront.request(queryProduct, {
        handle: handle,
        imagesFirst: 2,
      });
      if (!response.productByHandle) return;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    products,
    loading,
    fetchData,
    fetchProduct,
  };
}