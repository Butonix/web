<template>
  <v-bottom-sheet v-if="!$device.isDesktop" v-model="menu">
    <template v-slot:activator="{ on }">
      <v-btn
        class="betterbutton"
        outlined
        rounded
        style="border-width: 1px"
        :style="
          $vuetify.theme.dark
            ? 'border-color: rgba(255, 255, 255, 0.12);'
            : 'border-color: rgba(0, 0, 0, 0.12);'
        "
        v-on="on"
      >
        <v-icon class="mr-2">{{
          $route.query.feed === 'mytopics' ? 'mdi-newspaper' : 'mdi-infinity'
        }}</v-icon>
        {{ $route.query.feed === 'mytopics' ? 'My Topics' : 'All' }}
      </v-btn>
    </template>

    <TypeMenuContent />
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
        class="betterbutton"
        outlined
        rounded
        style="border-width: 1px"
        :style="
          $vuetify.theme.dark
            ? 'border-color: rgba(255, 255, 255, 0.12);'
            : 'border-color: rgba(0, 0, 0, 0.12);'
        "
        v-on="on"
      >
        <v-icon class="mr-2">{{
          $route.query.feed === 'mytopics' ? 'mdi-newspaper' : 'mdi-infinity'
        }}</v-icon>
        {{ $route.query.feed === 'mytopics' ? 'My Topics' : 'All' }}
      </v-btn>
    </template>

    <TypeMenuContent @selected="menu = false" />
  </v-menu>
</template>

<script>
import TypeMenuContent from './TypeMenuContent'

export default {
  name: 'TypeMenu',
  components: { TypeMenuContent },
  data() {
    return {
      menu: false
    }
  }
}
</script>

<style scoped></style>
