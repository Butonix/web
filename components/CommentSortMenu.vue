<template>
  <v-bottom-sheet v-model="menu" inset :width="$device.isDesktop ? '20%' : ''">
    <template v-slot:activator="{ on }">
      <v-btn
        class="betterbutton"
        outlined
        rounded
        :style="
          $vuetify.theme.dark
            ? 'border-color: rgba(255, 255, 255, 0.12);'
            : 'border-color: rgba(0, 0, 0, 0.12);'
        "
        v-on="on"
      >
        <v-icon v-if="!$route.query.sort" class="mr-2">{{ icons.top }}</v-icon>
        <v-icon v-else-if="$route.query.sort === 'new'" class="mr-2">{{
          icons.new
        }}</v-icon>

        <span v-if="!$route.query.sort">Top</span>
        <span v-else-if="$route.query.sort === 'new'">New</span>
      </v-btn>
    </template>

    <v-list class="py-0">
      <v-list-item @click="chooseTop">
        <v-list-item-icon>
          <v-icon>{{ icons.top }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            :class="!$route.query.sort ? 'font-weight-bold' : ''"
            >Top</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="chooseNew">
        <v-list-item-icon>
          <v-icon>{{ icons.new }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            :class="$route.query.sort === 'new' ? 'font-weight-bold' : ''"
            >New</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-bottom-sheet>
</template>

<script>
import { mdiFormatListNumbered, mdiClockTimeOneOutline } from '@mdi/js'

export default {
  name: 'CommentSortMenu',
  data() {
    return {
      menu: false,
      icons: {
        new: mdiClockTimeOneOutline,
        top: mdiFormatListNumbered
      }
    }
  },
  methods: {
    chooseTop() {
      this.menu = false
      const query = Object.assign({}, this.$route.query)
      delete query.sort
      this.$router.push({
        path: this.$route.path,
        query
      })
    },
    chooseNew() {
      this.menu = false
      const query = Object.assign({}, this.$route.query)
      query.sort = 'new'
      this.$router.push({
        path: this.$route.path,
        query
      })
    }
  }
}
</script>

<style scoped></style>
