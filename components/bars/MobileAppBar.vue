<template>
  <v-app-bar
    app
    flat
    :color="$vuetify.theme.dark ? '#202124' : '#FFFFFF'"
    :style="
      $vuetify.theme.dark
        ? 'border-bottom: 1px solid rgba(255, 255, 255, .12)'
        : 'border-bottom: 1px solid rgba(0, 0, 0, .12)'
    "
  >
    <v-row class="ma-0" align="center">
      <nuxt-link :to="{ path: '/', query: $store.state.homeQuery }">
        <v-img
          alt="Comet logo"
          :src="require('~/assets/comet_logo2.png')"
          width="96"
          contain
        />
      </nuxt-link>

      <v-spacer />

      <div v-if="$route.name.startsWith('post')">
        <CommentSortMenu />
      </div>

      <div
        v-if="$route.path === '/' || $route.name.startsWith('topic-')"
        class="ml-4"
      >
        <TypeMenu />
      </div>

      <div
        v-if="$route.path === '/' || $route.name.startsWith('topic-')"
        class="ml-2"
      >
        <SortMenu />
      </div>

      <ProfileMenu />
    </v-row>
  </v-app-bar>
</template>

<script>
import CommentSortMenu from '../buttons/CommentSortMenu'
import ProfileMenu from '../buttons/ProfileMenu'
import SortMenu from '../buttons/SortMenu'
import TypeMenu from '../buttons/TypeMenu'

export default {
  name: 'MobileAppBar',
  components: { CommentSortMenu, ProfileMenu, SortMenu, TypeMenu }
}
</script>

<style scoped></style>
