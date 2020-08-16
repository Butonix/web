<template>
  <div style="height: 100%; display: flex; flex-direction: row">
    <span
      class="hoverable text--secondary"
      style="position: absolute; bottom: 16px; left: 16px"
      >Change Image</span
    >

    <div
      v-if="$device.isDesktop"
      style="width: 60%; height: 100vh; background-size: cover; background-position: center; transition: background-image 3s ease-in-out"
      :style="`background-image: url(${images[currentImage]})`"
    >
      <div
        style="position: absolute; width: 25%; height: 100%; bottom: 0; right: 40%; background-color: transparent"
        :style="{
          'background-image': $vuetify.theme.dark
            ? 'linear-gradient(270deg,#202124,rgba(32,33,36,0))'
            : 'linear-gradient(270deg,#F1F3F4,rgba(241,243,244,0))'
        }"
      />
    </div>

    <v-row
      no-gutters
      align="center"
      justify="center"
      :style="$device.isDesktop ? 'width: 40%' : 'width: 100%'"
      style="height: 100vh"
    >
      <v-btn
        depressed
        rounded
        text
        style="position: absolute; top: 16px; right: 16px"
        class="text--secondary"
        >Continue without logging in</v-btn
      >

      <v-col cols="5">
        <div style="display: flex; flex-direction: column">
          <v-img src="/logo.png" width="148" style="margin-bottom: 24px" />

          <div style="font-size: 2rem; font-weight: 500; margin-bottom: 24px">
            See what's in
            <v-menu open-on-hover bottom offset-y nudge-left="200">
              <template v-slot:activator="{ on }">
                <span v-on="on">orbit</span>
              </template>

              <v-card width="400">
                <v-card-title style="font-size: 2rem">or·bit</v-card-title>
                <v-card-subtitle style="font-size: 1rem">
                  <span><em>noun.</em></span>
                  <ol>
                    <li>
                      the curved path of a celestial object or spacecraft around
                      a star, planet, or moon, especially a periodic elliptical
                      revolution.
                    </li>
                    <li>a sphere of activity, interest, or application.</li>
                  </ol>
                </v-card-subtitle>
              </v-card>
            </v-menu>
            .
          </div>

          <v-btn
            class="flex-grow-1"
            depressed
            rounded
            color="primary"
            style="margin-bottom: 12px"
            >Sign Up</v-btn
          >

          <v-btn
            class="flex-grow-1"
            depressed
            rounded
            color="primary"
            outlined
            style="margin-bottom: 12px"
            >Login</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  layout: 'login',
  data() {
    return {
      step: 1,
      backgroundUrl: null,
      images: [
        'https://cdn.spacetelescope.org/archives/images/wallpaper4/heic2007a.jpg',
        'https://cdn.spacetelescope.org/archives/images/wallpaper4/heic1509a.jpg',
        'https://cdn.spacetelescope.org/archives/images/wallpaper4/heic1107a.jpg'
      ],
      currentImage: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.currentImage++
      if (this.currentImage >= this.images.length) this.currentImage = 0
    }, 10000)
  },
  head: {
    title: 'Sign Up'
  }
}
</script>

<style scoped></style>
