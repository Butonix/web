<template>
  <v-row>
    <v-col cols="2">
      <v-tabs vertical>
        <v-tab nuxt to="/settings/account">Account Settings</v-tab>
        <v-tab nuxt to="/settings/blockedusers">Blocked Users</v-tab>
        <v-tab nuxt to="/settings/blockedplanets">Blocked Planets</v-tab>
        <v-tab nuxt to="/settings/hiddenposts">Hidden Posts</v-tab>
      </v-tabs>
    </v-col>

    <v-col>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {}
</script>

<style scoped></style>
