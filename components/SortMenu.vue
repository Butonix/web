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
        <v-icon
          v-if="$route.query.sort === 'hot' || !$route.query.sort"
          class="mr-2"
          >{{ icons.hot }}</v-icon
        >
        <v-icon v-else-if="$route.query.sort === 'top'" class="mr-2">{{
          icons.top
        }}</v-icon>
        <v-icon v-else-if="$route.query.sort === 'new'" class="mr-2">{{
          icons.new
        }}</v-icon>

        <span v-if="$route.query.sort === 'hot' || !$route.query.sort"
          >Hot</span
        >
        <span v-else-if="$route.query.sort === 'top'">Top</span>
        <span v-else-if="$route.query.sort === 'new'">New</span>
      </v-btn>
    </template>

    <v-list class="py-0">
      <v-list-item @click="chooseHot">
        <v-list-item-icon>
          <v-icon>{{ icons.hot }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            :class="!$route.query.sort ? 'font-weight-bold' : ''"
            >Hot</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="chooseTop">
        <v-list-item-icon>
          <v-icon>{{ icons.top }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            :class="$route.query.sort === 'top' ? 'font-weight-bold' : ''"
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

      <v-divider class="my-0" />

      <v-list-item
        :disabled="$route.query.sort !== 'top'"
        @click="chooseTimeAll"
      >
        <v-list-item-action>
          <v-radio-group v-model="allTime">
            <v-radio
              value="yes"
              :disabled="$route.query.sort !== 'top'"
              readonly
            />
          </v-radio-group>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>All Time</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        :disabled="$route.query.sort !== 'top'"
        @click="chooseTimeHour"
      >
        <v-list-item-action>
          <v-radio-group v-model="hour">
            <v-radio
              value="yes"
              :disabled="$route.query.sort !== 'top'"
              readonly
            />
          </v-radio-group>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Hour</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        :disabled="$route.query.sort !== 'top'"
        @click="chooseTimeDay"
      >
        <v-list-item-action>
          <v-radio-group v-model="day">
            <v-radio
              value="yes"
              :disabled="$route.query.sort !== 'top'"
              readonly
            />
          </v-radio-group>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Day</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        :disabled="$route.query.sort !== 'top'"
        @click="chooseTimeWeek"
      >
        <v-list-item-action>
          <v-radio-group v-model="week">
            <v-radio
              value="yes"
              :disabled="$route.query.sort !== 'top'"
              readonly
            />
          </v-radio-group>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Week</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        :disabled="$route.query.sort !== 'top'"
        @click="chooseTimeMonth"
      >
        <v-list-item-action>
          <v-radio-group v-model="month">
            <v-radio
              value="yes"
              :disabled="$route.query.sort !== 'top'"
              readonly
            />
          </v-radio-group>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Month</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        :disabled="$route.query.sort !== 'top'"
        @click="chooseTimeYear"
      >
        <v-list-item-action>
          <v-radio-group v-model="year">
            <v-radio
              value="yes"
              :disabled="$route.query.sort !== 'top'"
              readonly
            />
          </v-radio-group>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Year</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-bottom-sheet>
</template>

<script>
import { mdiFire, mdiFormatListNumbered, mdiClockTimeOneOutline } from '@mdi/js'

export default {
  name: 'SortMenu',
  data() {
    return {
      menu: false,
      icons: {
        hot: mdiFire,
        new: mdiClockTimeOneOutline,
        top: mdiFormatListNumbered
      }
    }
  },
  computed: {
    allTime() {
      return !this.$route.query.time ? 'yes' : null
    },
    hour() {
      return this.$route.query.time === 'hour' ? 'yes' : null
    },
    day() {
      return this.$route.query.time === 'day' ? 'yes' : null
    },
    week() {
      return this.$route.query.time === 'week' ? 'yes' : null
    },
    month() {
      return this.$route.query.time === 'month' ? 'yes' : null
    },
    year() {
      return this.$route.query.time === 'year' ? 'yes' : null
    }
  },
  methods: {
    chooseHot() {
      this.menu = false
      const query = Object.assign({}, this.$route.query)
      delete query.sort
      delete query.time
      this.$router.push({ path: this.$route.path, query })
    },
    chooseTop() {
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, sort: 'top' }
      })
    },
    chooseNew() {
      this.menu = false
      const query = Object.assign({}, this.$route.query)
      query.sort = 'new'
      delete query.time
      this.$router.push({
        path: this.$route.path,
        query
      })
    },
    chooseTimeAll() {
      if (this.$route.query.sort === 'top') this.menu = false
      const query = Object.assign({}, this.$route.query)
      delete query.time
      this.$router.push({ path: this.$route.path, query })
    },
    chooseTimeHour() {
      if (this.$route.query.sort === 'top') this.menu = false
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, time: 'hour' }
      })
    },
    chooseTimeDay() {
      if (this.$route.query.sort === 'top') this.menu = false
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, time: 'day' }
      })
    },
    chooseTimeWeek() {
      if (this.$route.query.sort === 'top') this.menu = false
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, time: 'week' }
      })
    },
    chooseTimeMonth() {
      if (this.$route.query.sort === 'top') this.menu = false
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, time: 'month' }
      })
    },
    chooseTimeYear() {
      if (this.$route.query.sort === 'top') this.menu = false
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, time: 'year' }
      })
    }
  }
}
</script>

<style scoped></style>
