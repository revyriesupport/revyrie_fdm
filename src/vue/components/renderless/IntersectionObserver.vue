<script>
import { onMounted, onUnmounted } from "vue";

export default {
  name: "IntersectionObserver",
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["intersect"],
  setup(props, { emit }) {
    let observer = null;

    const observeElement = (element) => {
      if (element && observer) {
        observer.observe(element);
      }
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          emit("intersect", entry, observer);
        }
      });
    };

    onMounted(() => {
      observer = new IntersectionObserver(handleIntersection, props.options);
    });

    onUnmounted(() => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    });

    return {
      observeElement,
    };
  },
};
</script>
