<template>
  <v-btn
    small
    icon
    class="text--secondary ml-0"
    aria-label="Post Options"
    @click.stop.prevent="click"
  >
    <v-icon size="20">{{ $vuetify.icons.values.mdiDotsVertical }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'PostOptionsBtn',
  methods: {
    click(event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style scoped></style>
