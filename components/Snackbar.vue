<template>
  <v-snackbar
    v-model="snackbarEnabled"
    style="position: fixed; bottom: 64px"
    bottom
    color="primary"
    >{{ snackbarMessage }}</v-snackbar
  >
</template>

<script>
export default {
  name: 'Snackbar',
  computed: {
    snackbarEnabled() {
      return this.$store.state.snackbarEnabled
    },
    snackbarMessage() {
      return this.$store.state.snackbarMessage
    }
  }
}
</script>

<style scoped></style>
