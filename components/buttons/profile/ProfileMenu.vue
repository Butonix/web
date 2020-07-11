<template>
  <v-bottom-sheet v-if="!$device.isDesktop" v-model="menu">
    <template v-slot:activator="{ on }">
      <v-btn v-if="!$device.isDesktop" aria-label="Account" icon v-on="on">
        <v-icon>{{ $vuetify.icons.values.mdiAccountOutline }}</v-icon>
      </v-btn>

      <v-btn
        v-else
        aria-label="Account"
        text
        rounded
        class="betterbutton"
        v-on="on"
      >
        <v-avatar
          v-if="
            $store.state.currentUser && $store.state.currentUser.profilePicUrl
          "
          class="mr-2"
        >
          <v-img
            alt="Profile picture"
            :src="$store.state.currentUser.profilePicUrl"
          />
        </v-avatar>

        <v-icon v-else class="mr-2">{{
          $vuetify.icons.values.mdiAccountOutline
        }}</v-icon>

        {{
          $store.state.currentUser
            ? $store.state.currentUser.username
            : 'Not logged in'
        }}
      </v-btn>
    </template>

    <ProfileMenuContent @selected="menu = false" />
  </v-bottom-sheet>

  <v-menu v-else v-model="menu" bottom offset-y transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn v-if="!$device.isDesktop" aria-label="Account" icon v-on="on">
        <v-icon>{{ $vuetify.icons.values.mdiAccountOutline }}</v-icon>
      </v-btn>

      <v-btn
        v-else
        aria-label="Account"
        text
        rounded
        class="betterbutton"
        v-on="on"
      >
        <v-avatar
          v-if="
            $store.state.currentUser && $store.state.currentUser.profilePicUrl
          "
          size="24"
          class="mr-2"
        >
          <v-img
            alt="Profile picture"
            :src="$store.state.currentUser.profilePicUrl"
          />
        </v-avatar>

        <v-icon v-else class="mr-2">{{
          $vuetify.icons.values.mdiAccountOutline
        }}</v-icon>

        {{
          $store.state.currentUser
            ? $store.state.currentUser.username
            : 'Not logged in'
        }}
      </v-btn>
    </template>

    <ProfileMenuContent />
  </v-menu>
</template>

<script>
import ProfileMenuContent from './ProfileMenuContent'

export default {
  name: 'ProfileMenu',
  components: { ProfileMenuContent },
  data() {
    return {
      menu: false
    }
  }
}
</script>

<style scoped></style>
