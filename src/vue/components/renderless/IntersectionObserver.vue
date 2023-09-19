<script>
import { sliderIntersectionOptions } from "@/lib/store-definition";
import { ref, onMounted, onBeforeUnmount, defineComponent } from "vue";

export default defineComponent({
  props: {
    unobserveOnEnter: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const observerElement = ref(null);
    const observer = ref(null);
    const options = props.options || sliderIntersectionOptions;

    const initObserver = () => {
      observer.value = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            emit("enterViewport");
            if (props.unobserveOnEnter) {
              observer.value.unobserve(observerElement.value);
            }
          } else {
            emit("leaveViewport");
          }
        });
      }, options);

      observer.value.observe(observerElement.value);
    };

    onMounted(initObserver);
    onBeforeUnmount(() => {
      observer.value.disconnect();
    });

    return { observerElement };
  },
});
</script>

<template>
  <div ref="observerElement">
    <slot></slot>
  </div>
</template>
