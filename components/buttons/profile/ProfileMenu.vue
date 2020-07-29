<template>
  <v-bottom-sheet v-if="!$device.isDesktop" v-model="menu">
    <template v-slot:activator="{ on }">
      <v-btn
        style="font-weight: 400"
        aria-label="Account"
        text
        rounded
        height="34"
        v-on="on"
      >
        <v-avatar
          v-if="
            $store.state.currentUser && $store.state.currentUser.profilePicUrl
          "
          color="#65C9FF"
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
            : 'Log In'
        }}
      </v-btn>
    </template>

    <ProfileMenuContent @selected="menu = false" />
  </v-bottom-sheet>

  <v-menu v-else v-model="menu" bottom offset-y transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn
        style="font-weight: 400"
        aria-label="Account"
        text
        rounded
        height="34"
        v-on="on"
      >
        <v-avatar
          v-if="
            $store.state.currentUser && $store.state.currentUser.profilePicUrl
          "
          color="#65C9FF"
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
            : 'Log In'
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
