import { defineStore } from 'pinia';

const useGlobalStoreDefinition = defineStore({
  id: 'global',
  state: () => ({
    template: '',
  }),
  getters: {},
  actions: {
    setTemplate(name) {
      this.template = name;
    },
  },
});

export const useGlobalStore = useGlobalStoreDefinition;
