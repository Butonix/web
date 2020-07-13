<template>
  <v-bottom-sheet v-if="!$device.isDesktop" v-model="menu">
    <template v-slot:activator="{ on }">
      <v-btn
        aria-label="Select Post Feed"
        small
        outlined
        rounded
        class="font-weight-regular"
        style="border-width: 1px"
        :style="
          $vuetify.theme.dark
            ? 'border-color: rgba(255, 255, 255, 0.12);'
            : 'border-color: rgba(0, 0, 0, 0.12);'
        "
        v-on="on"
      >
        <v-icon size="20" class="mr-2">{{
          $route.query.feed === 'mytopics'
            ? $vuetify.icons.values.mdiNewspaper
            : $vuetify.icons.values.mdiInfinity
        }}</v-icon>
        {{ $route.query.feed === 'mytopics' ? 'My Topics' : 'All' }}
      </v-btn>
    </template>

    <HomeTypeMenuContent />
  </v-bottom-sheet>

  <v-menu
    v-else
    v-model="menu"
    :close-on-content-click="false"
    bottom
    offset-y
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        aria-label="Select Post Feed"
        small
        outlined
        rounded
        class="font-weight-regular"
        style="border-width: 1px"
        :style="
          $vuetify.theme.dark
            ? 'border-color: rgba(255, 255, 255, 0.12);'
            : 'border-color: rgba(0, 0, 0, 0.12);'
        "
        v-on="on"
      >
        <v-icon size="20" class="mr-2">{{
          $route.query.feed === 'mytopics'
            ? $vuetify.icons.values.mdiNewspaper
            : $vuetify.icons.values.mdiInfinity
        }}</v-icon>
        {{ $route.query.feed === 'mytopics' ? 'My Topics' : 'All' }}
      </v-btn>
    </template>

    <HomeTypeMenuContent @selected="menu = false" />
  </v-menu>
</template>

<script>
import HomeTypeMenuContent from '../type/TypeMenuContent'

export default {
  name: 'HomeTypeMenu',
  components: { HomeTypeMenuContent },
  data() {
    return {
      menu: false
    }
  }
}
</script>

<style scoped></style>
