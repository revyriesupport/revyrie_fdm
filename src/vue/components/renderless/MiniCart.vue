<script>
import { computed } from "vue";
import { useCartStore } from "@/vue/store/cart";

export default {
  props: {
    shopifyData: Object,
  },
  setup(props, { slots }) {
    console.log("Setup!:", props);
    console.log("Slots!:", slots);
    const cart = useCartStore();
    console.log("cart:", cart);

    // const remove = (id) => {
    //   console.log("Remove item:", id);
    // };

    // return {
    //   cart,
    //   removeItem,
    // };

    return () =>
      slots.default({
        virtual: computed(() => cart.virtualDOM).value,
        toggle: () => cart.setVirtualDOM(!cart.virtualDOM),
      });
  },
};
</script>
