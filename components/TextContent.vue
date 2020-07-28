<template functional>
  <div
    style="font-size: 1rem; line-height: 1.5"
    class="text--primary"
    :class="props.dark ? 'editor-dark__content' : 'editor-light__content'"
    v-html="props.textContent"
  />
</template>

<script>
export default {
  name: 'TextContent',
  props: {
    textContent: {
      type: String,
      required: true
    },
    dark: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped></style>
