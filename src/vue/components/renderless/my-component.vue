<script>
import { computed } from "vue";

export default {
  setup(props, { slots }) {
    console.log("Setup!");
    // const store = useStore()

    // return () => slots.default({
    //   visible: computed(() => store.state['my-module'].visible).value,
    //   toggle: () => store.dispatch('my-module/toggle')
    // })
  },
};
</script>
