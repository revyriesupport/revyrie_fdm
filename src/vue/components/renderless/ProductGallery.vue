<script>
import { ref, onMounted, defineComponent } from "vue";
import { useProductStore } from "@store/product-state";
export default defineComponent({
  name: "product-gallery",
  props: {
    media: {
      type: Array,
      default: () => [],
    },
    activeColor: {
      type: String,
      default: "",
    },
  },
  setup(props, { slots }) {
    const loadedImages = ref({});

    console.log("props.activeColor:", props);
    const product = useProductStore();
    product.setActiveColor(props.activeColor);

    const loadRemainingImages = (media) => {
      media.forEach((mediaItem) => {
        if (mediaItem.media_type === "image") {
          const img = new Image();
          img.src = mediaItem.src;
          img.onload = () => {
            loadedImages.value[mediaItem.id] = mediaItem.src;
          };
        } else if (
          mediaItem.media_type === "video" ||
          mediaItem.media_type === "external_video"
        ) {
          // Preload Video
        }
      });
    };

    onMounted(() => {
      loadRemainingImages(props.media);
      product.setAllProductMedia(props.media);
    });

    return () =>
      slots.default({
        loadedImages: loadedImages.value,
        getImagesPerColor: product.getImagesPerColor,
      });
  },
});
</script>
