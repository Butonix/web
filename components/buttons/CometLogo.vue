<template>
  <div style="cursor: pointer" @click="clickCometLogo">
    <v-img
      alt="Comet logo"
      :src="$device.isDesktop ? '/logo.png' : '/logo_mobile.png'"
      :width="$device.isDesktop ? 128 : 48"
      contain
    />
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
        this.$router.push({ path: '/', query: this.$store.state.homeQuery })
      }
    }
  }
}
</script>

<style scoped></style>
