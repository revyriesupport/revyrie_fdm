<script>
import { computed } from 'vue'

console.log('Test')

export default {

  setup(props, { slots }) {
    console.log('SETUUUUUP!', props)
    // const store = useStore()

    // return () => slots.default({
    //   visible: computed(() => store.state['my-module'].visible).value,
    //   toggle: () => store.dispatch('my-module/toggle')
    // })
  }
}
</script>