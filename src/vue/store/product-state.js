import { defineStore } from 'pinia';

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
      return (activeColor) => {
        console.log('---------getImagesPerColor', activeColor)
        console.log('IMAGES:', this.media.filter((image) => {
          return image.alt.includes(activeColor);
        }))
        return this.media.filter((image) => {
          return image.alt.includes(`:${activeColor}`);
        });
      };
    }
  },
  actions: {
    setActiveColor(color) {
      this.activeColor = color;
    },
    setAllProductMedia(media) {
      this.media = media
    }
  },
});

export const useProductStore = useProductStoreDefinition;