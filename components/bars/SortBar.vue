<template>
  <v-toolbar
    dense
    flat
    :style="{
      'border-width': '1px',
      'border-color': $vuetify.theme.dark
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.12)',
      'border-style': 'solid'
    }"
    outlined
    style="border-radius: 10px; background-color: transparent"
  >
    <v-toolbar-items>
      <v-btn
        text
        nuxt
        :to="{
          query: {}
        }"
        :color="
          !$route.query.sort || $route.query.sort === 'hot' ? 'primary' : ''
        "
      >
        <v-icon class="mr-2">{{ $vuetify.icons.values.mdiFire }}</v-icon>
        Hot
      </v-btn>
      <v-btn
        text
        nuxt
        :to="{
          query: {
            sort: 'new'
          }
        }"
        :color="$route.query.sort === 'new' ? 'primary' : ''"
      >
        <v-icon class="mr-2">{{
          $vuetify.icons.values.mdiClockTimeOneOutline
        }}</v-icon>
        New
      </v-btn>
      <v-btn
        text
        nuxt
        :to="{
          query: {
            sort: 'top'
          }
        }"
        :color="$route.query.sort === 'top' ? 'primary' : ''"
      >
        <v-icon class="mr-2">{{
          $vuetify.icons.values.mdiFormatListNumbered
        }}</v-icon>
        Top
      </v-btn>

      <v-menu offset-y transition="slide-y-transition">
        <template v-slot:activator="{ on }">
          <v-btn
            v-show="$route.query.sort === 'top'"
            text
            class="text--secondary"
            v-on="on"
          >
            {{
              $route.query.t
                ? $route.query.t.substring(0, 1).toUpperCase() +
                  $route.query.t.substring(1).toLowerCase()
                : 'Day'
            }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            :color="$route.query.t === 'hour' ? 'primary' : ''"
            nuxt
            :to="{
              query: {
                ...$route.query,
                t: 'hour'
              }
            }"
          >
            <v-list-item-content>
              <v-list-item-title>Hour</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            :color="
              !$route.query.t || $route.query.t === 'day' ? 'primary' : ''
            "
            nuxt
            :to="{
              query: {
                ...$route.query,
                t: 'day'
              }
            }"
          >
            <v-list-item-content>
              <v-list-item-title
                :style="
                  !$route.query.t || $route.query.t === 'day'
                    ? 'color: var(--v-primary-base) !important;'
                    : ''
                "
                >Day</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            :color="$route.query.t === 'week' ? 'primary' : ''"
            nuxt
            :to="{
              query: {
                ...$route.query,
                t: 'week'
              }
            }"
          >
            <v-list-item-content>
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            :color="$route.query.t === 'month' ? 'primary' : ''"
            nuxt
            :to="{
              query: {
                ...$route.query,
                t: 'month'
              }
            }"
          >
            <v-list-item-content>
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            :color="$route.query.t === 'year' ? 'primary' : ''"
            nuxt
            :to="{
              query: {
                ...$route.query,
                t: 'year'
              }
            }"
          >
            <v-list-item-content>
              <v-list-item-title>Year</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            :color="$route.query.t === 'all' ? 'primary' : ''"
            nuxt
            :to="{
              query: {
                ...$route.query,
                t: 'all'
              }
            }"
          >
            <v-list-item-content>
              <v-list-item-title>All</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: 'SortBar'
}
</script>

<style scoped></style>
