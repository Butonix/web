<template>
  <v-app-bar
    app
    flat
    :color="$vuetify.theme.dark ? '#202124' : ''"
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
          :src="
            $vuetify.theme.dark
              ? require('~/assets/comet_logo2.png')
              : require('~/assets/comet_logo2.png')
          "
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

      <v-text-field
        hide-details
        flat
        dense
        class="mr-4"
        style="max-width: 400px"
        solo
        label="Search"
        :append-icon="$vuetify.icons.values.mdiMagnify"
      />

      <v-menu
        offset-y
        transition="slide-y-transition"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon class="mr-1" v-on="on">
            <v-badge overlap content="1">
              <v-icon>{{ $vuetify.icons.values.mdiBellOutline }}</v-icon>
            </v-badge>
          </v-btn>
        </template>

        <v-card class="pa-2" width="300">
          <v-card outlined class="mb-2">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle
                  >This is a notification</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
            <v-card-actions>
              <UsernameMenu :user="$store.state.currentUser" />
            </v-card-actions>
          </v-card>

          <div
            style="display: flex; justify-content: center"
            class="caption text--secondary"
          >
            That's all!
          </div>
        </v-card>
      </v-menu>

      <div class="mr-1">
        <ProfileMenu />
      </div>

      <client-only>
        <v-menu offset-y transition="slide-y-transition">
          <template v-slot:activator="{ on }">
            <v-btn icon :color="$vuetify.theme.dark ? '' : '#7289da'" v-on="on">
              <v-icon>{{ $vuetify.icons.values.mdiDiscord }}</v-icon>
            </v-btn>
          </template>

          <iframe
            title="Discord widget"
            :src="
              `https://discordapp.com/widget?id=653652395959648314${
                $vuetify.theme.dark ? '&theme=dark' : '&theme=light'
              }`
            "
            class="frame"
            height="500"
            allowtransparency="true"
            frameborder="0"
          />
        </v-menu>
      </client-only>
    </v-row>
  </v-app-bar>
</template>

<script>
import CommentSortMenu from './buttons/CommentSortMenu'
import ProfileMenu from './buttons/ProfileMenu'
import SortMenu from './buttons/SortMenu'
import TypeMenu from './buttons/TypeMenu'
import UsernameMenu from './UsernameMenu'

export default {
  name: 'DesktopAppBar',
  components: {
    UsernameMenu,
    CommentSortMenu,
    ProfileMenu,
    SortMenu,
    TypeMenu
  }
}
</script>

<style scoped></style>
