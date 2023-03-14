import { ref } from "vue";
import storefront from "@/lib/storefront";
import { collection as queryCollection } from "@/lib/queries";

export default function useProductCollection(collectionHandle, limit = 10) {
  const products = ref([]);
  const loading = ref(true);

  const fetchData = async () => {
    try {
      const response = await storefront.request(queryCollection, {
        handle: collectionHandle,
        first: parseInt(limit),
      });
      if (!response.collectionByHandle) return;
      products.value = response.collectionByHandle.products.edges;
      loading.value = false;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    products,
    loading,
    fetchData,
  };
}