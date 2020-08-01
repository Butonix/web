<template>
  <v-row>
    <v-col>
      <v-tabs :grow="!$device.isDesktop" background-color="transparent">
        <v-tab
          nuxt
          to="/settings/account"
          style="letter-spacing: normal; text-transform: none; font-size: 1rem"
          class="text--secondary"
        >
          <v-icon size="20" class="mr-2">{{
            $vuetify.icons.values.mdiCogOutline
          }}</v-icon>
          Account Settings
        </v-tab>
        <v-tab
          nuxt
          to="/settings/blockedusers"
          style="letter-spacing: normal; text-transform: none; font-size: 1rem"
          class="text--secondary"
        >
          <v-icon size="20" class="mr-2">{{
            $vuetify.icons.values.mdiAccountCancelOutline
          }}</v-icon>
          Blocked Users
        </v-tab>
        <v-tab
          nuxt
          to="/settings/blockedplanets"
          style="letter-spacing: normal; text-transform: none; font-size: 1rem"
          class="text--secondary"
        >
          <v-icon size="20" class="mr-2">{{
            $vuetify.icons.values.mdiEarthOff
          }}</v-icon>
          Muted Planets
        </v-tab>
        <v-tab
          nuxt
          to="/settings/hiddenposts"
          style="letter-spacing: normal; text-transform: none; font-size: 1rem"
          class="text--secondary"
        >
          <v-icon size="20" class="mr-2">{{
            $vuetify.icons.values.mdiPost
          }}</v-icon>
          Hidden Posts
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: 'authenticated'
}
</script>

<style scoped></style>
