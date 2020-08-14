<template>
  <div style="cursor: pointer" @click="clickCometLogo">
    <v-img alt="Comet logo" src="/logo.png" width="108" contain />
  </div>
</template>

<script>
export default {
  name: 'CometLogo',
  methods: {
    clickCometLogo() {
      if (this.$route.path === '/') {
        window.scrollTo(0, 0)
      } else {
        this.$router.push({ path: '/' })
      }
    }
  }
}
</script>

<style scoped></style>
