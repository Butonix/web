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
    <v-toolbar-items class="flex-grow-1">
      <v-btn
        text
        nuxt
        :to="{
          path: (
            $route.path
              .replace('/hot', '')
              .replace('/top', '')
              .replace('/new', '')
              .replace('/hour', '')
              .replace('/day', '')
              .replace('/week', '')
              .replace('/month', '')
              .replace('/year', '')
              .replace('/all', '') + '/'
          ).replace('//', '/')
        }"
        :color="
          !$route.path.includes('/top') && !$route.path.includes('/new')
            ? 'primary'
            : ''
        "
      >
        <v-icon class="mr-2">{{ $vuetify.icons.values.mdiFire }}</v-icon>
        Hot
      </v-btn>
      <v-btn
        text
        nuxt
        :to="{
          path: (
            $route.path
              .replace('/hot', '')
              .replace('/top', '')
              .replace('/new', '')
              .replace('/hour', '')
              .replace('/day', '')
              .replace('/week', '')
              .replace('/month', '')
              .replace('/year', '')
              .replace('/all', '') + '/new'
          ).replace('//', '/')
        }"
        :color="$route.path.includes('/new') ? 'primary' : ''"
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
          path: (
            $route.path
              .replace('/hot', '')
              .replace('/top', '')
              .replace('/new', '')
              .replace('/hour', '')
              .replace('/day', '')
              .replace('/week', '')
              .replace('/month', '')
              .replace('/year', '')
              .replace('/all', '') + '/top/day'
          ).replace('//', '/')
        }"
        :color="$route.path.includes('/top') ? 'primary' : ''"
      >
        <v-icon class="mr-2">{{
          $vuetify.icons.values.mdiFormatListNumbered
        }}</v-icon>
        Top
      </v-btn>

      <v-menu offset-y transition="slide-y-transition">
        <template v-slot:activator="{ on }">
          <v-btn
            v-show="$route.path.includes('/top')"
            text
            class="text--secondary"
            v-on="on"
          >
            {{
              $route.path.includes('/top/')
                ? $route.path
                    .split('/top/')[1]
                    .charAt(0)
                    .toUpperCase() + $route.path.split('/top/')[1].substring(1)
                : 'Day'
            }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            :color="$route.params.time === 'hour' ? 'primary' : ''"
            nuxt
            :to="{
              params: { time: 'hour' }
            }"
          >
            <v-list-item-content>
              <v-list-item-title>Hour</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            :color="
              !$route.params.time || $route.params.time === 'day'
                ? 'primary'
                : ''
            "
            nuxt
            :to="{
              params: { time: 'day' }
            }"
          >
            <v-list-item-content>
              <v-list-item-title
                :style="
                  !$route.params.time || $route.params.time === 'day'
                    ? 'color: var(--v-primary-base) !important;'
                    : ''
                "
                >Day</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            :color="$route.params.time === 'week' ? 'primary' : ''"
            nuxt
            :to="{
              params: { time: 'week' }
            }"
          >
            <v-list-item-content>
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            :color="$route.params.time === 'month' ? 'primary' : ''"
            nuxt
            :to="{
              params: { time: 'month' }
            }"
          >
            <v-list-item-content>
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            :color="$route.params.time === 'year' ? 'primary' : ''"
            nuxt
            :to="{
              params: { time: 'year' }
            }"
          >
            <v-list-item-content>
              <v-list-item-title>Year</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            :color="$route.params.time === 'all' ? 'primary' : ''"
            nuxt
            :to="{
              params: { time: 'all' }
            }"
          >
            <v-list-item-content>
              <v-list-item-title>All</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-spacer />

      <v-btn
        text
        nuxt
        :to="
          $route.query.view === 'expanded'
            ? { query: { ...$route.query, view: 'collapsed' } }
            : { query: { ...$route.query, view: 'expanded' } }
        "
      >
        <v-icon class="mr-2">
          {{
            $route.query.view === 'expanded'
              ? $vuetify.icons.values.mdiArrowCollapse
              : $vuetify.icons.values.mdiArrowExpand
          }}
        </v-icon>
        {{
          $route.query.view === 'expanded' ? 'Collapse Posts' : 'Expand Posts'
        }}
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: 'SortBar'
}
</script>

<style scoped>
>>> .v-toolbar__content {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
