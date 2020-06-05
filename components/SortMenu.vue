<template>
  <div>
    <v-menu v-model="menu" offset-y :close-on-content-click="!isSelectingTime">
      <template v-slot:activator="{ on }">
        <v-btn text small v-on="on">
          <span class="mr-1"
            >Sort: {{ sort.sort }}
            {{ sort.sort === 'TOP' ? `(${selectedTopTime})` : '' }}</span
          >
          <v-icon v-if="sort.sort === 'HOT'" small>{{ icons.fire }}</v-icon>
          <v-icon v-if="sort.sort === 'TOP'" small>{{ icons.list }}</v-icon>
          <v-icon v-if="sort.sort === 'NEW'" small>{{ icons.clock }}</v-icon>
        </v-btn>
      </template>

      <v-list v-if="!isSelectingTime" dense>
        <v-list-item v-if="hotEnabled" @click="chooseHot">
          <v-list-item-icon class="mr-1">
            <v-icon small>{{ icons.fire }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Hot</v-list-item-title>
        </v-list-item>

        <v-list-item @click="switchToTimeSelect">
          <v-list-item-icon class="mr-1">
            <v-icon small>{{ icons.list }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Top</v-list-item-title>
        </v-list-item>

        <v-list-item @click="chooseNew">
          <v-list-item-icon class="mr-1">
            <v-icon small>{{ icons.clock }}</v-icon>
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
import { mdiFire, mdiFormatListBulletedSquare, mdiClockOutline } from '@mdi/js'

export default {
  name: 'SortMenu',
  props: {
    hotEnabled: {
      type: Boolean,
      default: true
    },
    defaultSort: {
      type: Object,
      default: () => ({
        sort: 'HOT',
        time: 'DAY'
      })
    }
  },
  data() {
    return {
      sort: this.defaultSort,
      menu: false,
      isSelectingTime: false,
      times: ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR', 'ALL'],
      icons: {
        fire: mdiFire,
        list: mdiFormatListBulletedSquare,
        clock: mdiClockOutline
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
      this.isSelectingTime = true
    },
    topTime(time) {
      switch (time) {
        case 'HOUR':
          return '1 hour'
        case 'DAY':
          return '24 hours'
        case 'WEEK':
          return 'Week'
        case 'MONTH':
          return 'Month'
        case 'YEAR':
          return 'Year'
        case 'ALL':
          return 'All'
        default:
          return undefined
      }
    },
    chooseTopTime(time) {
      this.sort.time = time
      this.isSelectingTime = false
      this.sort.sort = 'TOP'
    },
    chooseNew() {
      this.sort.sort = 'NEW'
    },
    chooseHot() {
      this.sort.sort = 'HOT'
    }
  }
}
</script>

<style scoped></style>
