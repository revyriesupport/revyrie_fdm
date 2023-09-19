import { defineStore } from 'pinia';

const {
  showShippingProgressBar,
  shippingThreshold,
  shippingProgressText,
  shippingCompleteText
} = window.freeShipping

const useGlobalStoreDefinition = defineStore({
  id: 'global',
  state: () => ({
    template: '',
    showShippingProgressBar: showShippingProgressBar,
    shippingThreshold: shippingThreshold,
    shippingProgressText: shippingProgressText,
    shippingCompleteText: shippingCompleteText,
  }),
  getters: {},
  actions: {
    setTemplate(name) {
      this.template = name;
    },
  },
});

export const useGlobalStore = useGlobalStoreDefinition;
