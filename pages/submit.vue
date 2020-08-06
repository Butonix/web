<template>
  <v-container>
    <v-row justify="center">
      <v-col :cols="$device.isDesktop ? 9 : 12">
        <v-row no-gutters>
          <v-tabs v-model="tab" grow background-color="transparent">
            <v-tab
              style="letter-spacing: normal; text-transform: none; font-size: 1rem"
              nuxt
              :to="
                `/submit/text${
                  $route.query.planet ? `?planet=${$route.query.planet}` : ''
                }`
              "
              :class="tab === '/submit/text' ? '' : 'text--primary'"
            >
              <v-icon
                class="mr-2"
                :class="tab === '/submit/text' ? '' : 'text--primary'"
                >{{ $vuetify.icons.values.mdiText }}</v-icon
              >
              Text Post
            </v-tab>
            <v-tab
              style="letter-spacing: normal; text-transform: none; font-size: 1rem"
              nuxt
              :to="
                `/submit/link${
                  $route.query.planet ? `?planet=${$route.query.planet}` : ''
                }`
              "
              :class="tab === '/submit/link' ? '' : 'text--primary'"
              ><v-icon
                class="mr-2"
                :class="tab === '/submit/link' ? '' : 'text--primary'"
                >{{ $vuetify.icons.values.mdiLink }}</v-icon
              >
              Link Post</v-tab
            >
            <v-tab
              style="letter-spacing: normal; text-transform: none; font-size: 1rem"
              nuxt
              :to="
                `/submit/image${
                  $route.query.planet ? `?planet=${$route.query.planet}` : ''
                }`
              "
              :class="tab === '/submit/image' ? '' : 'text--primary'"
              ><v-icon
                class="mr-2"
                :class="tab === '/submit/image' ? '' : 'text--primary'"
                >{{ $vuetify.icons.values.mdiImage }}</v-icon
              >
              Image Upload</v-tab
            >
          </v-tabs>
        </v-row>

        <div class="pt-6">
          <nuxt-child />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  middleware: 'authenticated',
  data() {
    return {
      tab: null
    }
  }
}
</script>

<style scoped>
>>> .v-slide-group__prev {
  display: none !important;
}

>>> .v-slide-group__next {
  display: none !important;
}
</style>
