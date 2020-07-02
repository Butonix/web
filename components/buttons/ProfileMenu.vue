<template>
  <v-bottom-sheet v-if="!$device.isDesktop" v-model="menu">
    <template v-slot:activator="{ on }">
      <v-btn v-if="!$device.isDesktop" icon v-on="on">
        <v-icon>mdi-account-outline</v-icon>
      </v-btn>

      <v-btn v-else text rounded class="betterbutton" v-on="on">
        <v-icon class="mr-2">mdi-account-outline</v-icon>
        {{ currentUser ? currentUser.username : 'Not logged in' }}
      </v-btn>
    </template>

    <ProfileMenuContent @selected="menu = false" />
  </v-bottom-sheet>

  <v-menu v-else v-model="menu" bottom offset-y transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn v-if="!$device.isDesktop" icon v-on="on">
        <v-icon>mdi-account-outline</v-icon>
      </v-btn>

      <v-btn v-else text rounded class="betterbutton" v-on="on">
        <v-icon class="mr-2">mdi-account-outline</v-icon>
        {{ currentUser ? currentUser.username : 'Not logged in' }}
      </v-btn>
    </template>

    <ProfileMenuContent />
  </v-menu>
</template>

<script>
import currentUserGql from '../../gql/currentUser.graphql'
import ProfileMenuContent from './ProfileMenuContent'

export default {
  name: 'ProfileMenu',
  components: { ProfileMenuContent },
  data() {
    return {
      menu: false,
      currentUser: null
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    }
  }
}
</script>

<style scoped></style>
