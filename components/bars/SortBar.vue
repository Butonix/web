<template>
  <v-app-bar
    height="44"
    flat
    :style="{
      'border-width': '1px',
      'border-color': $vuetify.theme.dark
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.12)',
      'border-style': $device.isDesktop ? 'solid' : 'none',
      'border-bottom-style': 'solid',
      'border-radius': $device.isDesktop ? '10px' : '0',
      'background-color': $vuetify.theme.dark ? '#202124' : '#F8F9FA'
    }"
    outlined
  >
    <v-toolbar-items class="flex-grow-1">
      <template v-if="$device.isDesktop">
        <v-btn
          v-show="!$route.name.includes('u-username')"
          :style="
            $device.isDesktop
              ? 'border-top-left-radius: 10px; border-bottom-left-radius: 10px'
              : ''
          "
          small
          text
          nuxt
          :to="{
            params: { ...$route.params, sort: 'hot' }
          }"
          :color="
            !$route.params.sort || $route.params.sort === 'hot' ? 'primary' : ''
          "
        >
          <v-icon size="20">{{ $vuetify.icons.values.mdiFire }}</v-icon>
          <span class="ml-2">
            Hot
          </span>
        </v-btn>
        <v-btn
          small
          text
          nuxt
          :to="{
            params: { ...$route.params, sort: 'new' }
          }"
          :color="$route.params.sort === 'new' ? 'primary' : ''"
        >
          <v-icon size="20">{{
            $vuetify.icons.values.mdiClockTimeOneOutline
          }}</v-icon>
          <span class="ml-2">
            New
          </span>
        </v-btn>
        <v-btn
          small
          text
          nuxt
          :to="{
            params: { ...$route.params, sort: 'top', time: 'day' }
          }"
          :color="$route.params.sort === 'top' ? 'primary' : ''"
        >
          <v-icon size="20">{{
            $vuetify.icons.values.mdiFormatListNumbered
          }}</v-icon>
          <span class="ml-2">
            Top
          </span>
        </v-btn>

        <v-btn
          small
          text
          nuxt
          :to="{
            params: { ...$route.params, sort: 'mostcomments', time: 'day' }
          }"
          :color="$route.params.sort === 'mostcomments' ? 'primary' : ''"
        >
          <v-icon size="20">{{
            $vuetify.icons.values.mdiCommentMultipleOutline
          }}</v-icon>
          <span class="ml-2">
            Most Comments
          </span>
        </v-btn>

        <v-menu offset-y transition="slide-y-transition">
          <template v-slot:activator="{ on }">
            <v-btn
              v-show="
                $route.params.sort === 'top' ||
                  $route.params.sort === 'mostcomments'
              "
              small
              text
              class="text--secondary"
              v-on="on"
            >
              {{
                $route.params.time
                  ? $route.params.time.charAt(0).toUpperCase() +
                    $route.params.time.substring(1)
                  : 'Day'
              }}
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              :color="$route.params.time === 'hour' ? 'primary' : ''"
              nuxt
              :to="{
                params: { ...$route.params, time: 'hour' }
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
                params: { ...$route.params, time: 'day' }
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
                params: { ...$route.params, time: 'week' }
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
                params: { ...$route.params, time: 'month' }
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
                params: { ...$route.params, time: 'year' }
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
                params: { ...$route.params, time: 'all' }
              }"
            >
              <v-list-item-content>
                <v-list-item-title>All</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <v-spacer />

      <TypeMenu v-if="$device.isDesktop" />
      <SortMenu v-else />

      <v-btn
        small
        text
        nuxt
        :to="
          $route.query.view === 'expanded'
            ? {
                query: {
                  ...() => {
                    const query = Object.assign({}, $route.query)
                    delete query.view
                    return query
                  }
                }
              }
            : { query: { ...$route.query, view: 'expanded' } }
        "
        :style="
          $device.isDesktop
            ? 'border-top-right-radius: 10px; border-bottom-right-radius: 10px'
            : ''
        "
      >
        <v-icon size="20">
          {{
            $route.query.view === 'expanded'
              ? $vuetify.icons.values.mdiArrowCollapse
              : $vuetify.icons.values.mdiArrowExpand
          }}
        </v-icon>
        <span v-if="$device.isDesktop" class="ml-2">
          {{
            $route.query.view === 'expanded'
              ? 'Collapse Posts'
              : 'Expand Posts (Experimental)'
          }}
        </span>
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import TypeMenu from '@/components/buttons/type/TypeMenu'
import SortMenu from '@/components/buttons/home_sort/SortMenu'

export default {
  name: 'SortBar',
  components: { SortMenu, TypeMenu },
  props: {
    planet: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>
>>> .v-toolbar__content {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
