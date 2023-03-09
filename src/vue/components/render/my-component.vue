<template>
  <div>
    <slot />

    <ul class="bg-red-300">
      <li
        v-for="(value, key) in shopifyData"
        :key="key"
      >
        {{ key }}: {{ value }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    shopifyData: {
      type: Object,
      required: true
    }
  }
}
</script>