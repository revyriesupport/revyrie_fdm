import { defineStore } from 'pinia';
import { generateFetchRequest } from '@/lib/utilities';

const useProductStoreDefinition = defineStore({
  id: 'product',
  state: () => ({
    isLoading: false,
    error: null,
    media: [],
    activeColor: null,
  }),
  getters: {
    isProductInCart() { },
    getImagesPerColor() {
      return this.media.filter((image) => {
        return image.alt.includes(this.activeColor);
      });
    }
  },
  actions: {
    setActiveColor(color) {
      this.activeColor = color;
    },
    setAllProductMedia(media) {
      this.media = media
    },
    // async fetchProductMedia(handle) {
    //   if (!handle) return;

    //   this.isLoading = true;

    //   try {
    //     const response = await generateFetchRequest(`/products/${handle}.js`, 'GET', null, null);
    //     const data = response.data;
    //     console.log('response:', response)
    //     const media = data.media;

    //     this.media = media;
    //     this.isLoading = false;
    //   } catch (error) {
    //     this.error = error;
    //     this.isLoading = false;
    //   }
    // },
  },
});

export const useProductStore = useProductStoreDefinition;
