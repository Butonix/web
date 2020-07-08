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
          alt="Comet Logo"
          :src="require('~/assets/comet_logo2.png')"
          width="96"
          contain
        />
      </nuxt-link>

      <div
        v-if="$store.state.currentPostTitle && $route.name.startsWith('post')"
        class="ml-4"
      >
        <div class="title">{{ $store.state.currentPostTitle }}</div>
        <div>
          {{ $store.state.currentPostComments }} Comment{{
            $store.state.currentPostComments === 1 ? '' : 's'
          }}
        </div>
      </div>

      <div v-if="$route.name.startsWith('post')" class="ml-4">
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

      <v-spacer />

      <ProfileMenu />
    </v-row>
  </v-app-bar>
</template>

<script>
import CommentSortMenu from './buttons/CommentSortMenu'
import ProfileMenu from './buttons/ProfileMenu'
import SortMenu from './buttons/SortMenu'
import TypeMenu from './buttons/TypeMenu'

export default {
  name: 'DesktopAppBar',
  components: { CommentSortMenu, ProfileMenu, SortMenu, TypeMenu }
}
</script>

<style scoped></style>
