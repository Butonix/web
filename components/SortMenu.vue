<template>
  <div>
    <v-menu v-model="menu" offset-y :close-on-content-click="!isSelectingTime">
      <template v-slot:activator="{ on }">
        <v-btn text small v-on="on">
          <span class="mr-1"
            >Sort: {{ sort.sort }}
            {{
              sort.sort === 'top' && timesEnabled ? `(${selectedTopTime})` : ''
            }}</span
          >
          <v-icon v-if="sort.sort === 'hot'" small>{{ icons.fire }}</v-icon>
          <v-icon v-if="sort.sort === 'top'" small>{{ icons.list }}</v-icon>
          <v-icon v-if="sort.sort === 'new'" small>{{ icons.clock }}</v-icon>
          <v-icon v-if="sort.sort === 'relevance'" small>{{
            icons.check
          }}</v-icon>
        </v-btn>
      </template>

      <v-list v-if="!isSelectingTime" dense>
        <v-list-item v-if="hotEnabled" @click="chooseHot">
          <v-list-item-icon class="mr-2">
            <v-icon>{{ icons.fire }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Hot</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="relevanceEnabled" @click="chooseRelevance">
          <v-list-item-icon class="mr-2">
            <v-icon>{{ icons.check }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Relevance</v-list-item-title>
        </v-list-item>

        <v-list-item @click="switchToTimeSelect">
          <v-list-item-icon class="mr-2">
            <v-icon>{{ icons.list }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Top</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="newEnabled" @click="chooseNew">
          <v-list-item-icon class="mr-2">
            <v-icon>{{ icons.clock }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>New</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-else dense>
        <v-list-item v-for="t in times" :key="t" @click="chooseTopTime(t)">
          <v-list-item-title>{{ topTime(t) }}</v-list-item-title>
        </v-list-item>
        <!--<v-list-item disabled>
          <v-list-item-title>Custom Date Range</v-list-item-title>
        </v-list-item>-->
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import {
  mdiFire,
  mdiFormatListBulletedSquare,
  mdiClockOutline,
  mdiCheck
} from '@mdi/js'

export default {
  name: 'SortMenu',
  props: {
    hotEnabled: {
      type: Boolean,
      default: true
    },
    timesEnabled: {
      type: Boolean,
      default: true
    },
    newEnabled: {
      type: Boolean,
      default: true
    },
    relevanceEnabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      sort: this.value,
      menu: false,
      isSelectingTime: false,
      times: ['hour', 'day', 'week', 'month', 'year', 'all'],
      icons: {
        fire: mdiFire,
        list: mdiFormatListBulletedSquare,
        clock: mdiClockOutline,
        check: mdiCheck
      }
    }
  },
  computed: {
    selectedTopTime() {
      return this.topTime(this.sort.time)
    }
  },
  watch: {
    sort: {
      handler() {
        this.$emit('input', this.sort)
      },
      deep: true
    },
    menu() {
      if (this.menu) this.isSelectingTime = false
    }
  },
  methods: {
    switchToTimeSelect() {
      if (!this.timesEnabled) {
        this.sort.sort = 'top'
        return
      }
      this.isSelectingTime = true
    },
    topTime(time) {
      switch (time) {
        case 'hour':
          return '1 hour'
        case 'day':
          return '24 hours'
        case 'week':
          return 'Week'
        case 'month':
          return 'Month'
        case 'year':
          return 'Year'
        case 'all':
          return 'All'
        default:
          return undefined
      }
    },
    chooseTopTime(time) {
      this.sort.time = time
      this.isSelectingTime = false
      this.sort.sort = 'top'
    },
    chooseNew() {
      this.sort.sort = 'new'
      this.sort.time = 'all'
    },
    chooseHot() {
      this.sort.sort = 'hot'
      this.sort.time = 'all'
    },
    chooseRelevance() {
      this.sort.sort = 'relevance'
      this.sort.time = 'all'
    }
  }
}
</script>

<style scoped></style>
