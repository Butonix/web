<template>
  <div style="cursor: pointer" @click="clickCometLogo">
    <v-img
      alt="Comet logo"
      :src="
        $vuetify.theme.dark
          ? require('~/assets/comet_logo2.png')
          : require('~/assets/comet_logo2.png')
      "
      width="96"
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
