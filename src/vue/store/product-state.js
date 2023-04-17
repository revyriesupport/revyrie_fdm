import { defineStore } from 'pinia';

const useProductStoreDefinition = defineStore({
  id: 'product',
  state: () => ({
    isLoading: false,
    error: null,
    media: [],
    activeColor: null,
  }),
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