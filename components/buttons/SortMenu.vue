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
        <v-icon
          v-if="$route.query.sort === 'hot' || !$route.query.sort"
          class="mr-2"
          >{{ $vuetify.icons.values.mdiFire }}</v-icon
        >
        <v-icon v-else-if="$route.query.sort === 'top'" class="mr-2">{{
          $vuetify.icons.values.mdiFormatListNumbered
        }}</v-icon>
        <v-icon v-else-if="$route.query.sort === 'new'" class="mr-2">{{
          $vuetify.icons.values.mdiClockTimeOneOutline
        }}</v-icon>

        <span v-if="$route.query.sort === 'hot' || !$route.query.sort"
          >Hot</span
        >
        <span v-else-if="$route.query.sort === 'top'">Top</span>
        <span v-else-if="$route.query.sort === 'new'">New</span>
      </v-btn>
    </template>
    <SortMenuContent :open="menu" @selected="menu = false" />
  </v-bottom-sheet>

  <v-menu
    v-else
    v-model="menu"
    bottom
    offset-y
    transition="slide-y-transition"
    :close-on-content-click="false"
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
        <v-icon
          v-if="$route.query.sort === 'hot' || !$route.query.sort"
          class="mr-2"
          >{{ $vuetify.icons.values.mdiFire }}</v-icon
        >
        <v-icon v-else-if="$route.query.sort === 'top'" class="mr-2">{{
          $vuetify.icons.values.mdiFormatListNumbered
        }}</v-icon>
        <v-icon v-else-if="$route.query.sort === 'new'" class="mr-2">{{
          $vuetify.icons.values.mdiClockTimeOneOutline
        }}</v-icon>

        <span v-if="$route.query.sort === 'hot' || !$route.query.sort"
          >Hot</span
        >
        <span v-else-if="$route.query.sort === 'top'"
          >Top{{
            $route.query.time
              ? ` (${$route.query.time
                  .substring(0, 1)
                  .toUpperCase()}${$route.query.time
                  .substring(1)
                  .toLowerCase()})`
              : ' (All)'
          }}</span
        >
        <span v-else-if="$route.query.sort === 'new'">New</span>
      </v-btn>
    </template>
    <SortMenuContent :open="menu" @selected="menu = false" />
  </v-menu>
</template>

<script>
import SortMenuContent from './SortMenuContent'

export default {
  name: 'SortMenu',
  components: { SortMenuContent },
  data() {
    return {
      menu: false
    }
  }
}
</script>

<style scoped></style>
