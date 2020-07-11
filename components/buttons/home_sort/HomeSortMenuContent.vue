<template>
  <div>
    <v-fade-transition hide-on-leave>
      <v-list v-show="!selectingTime" dense>
        <v-list-item @click="chooseHot">
          <v-list-item-icon class="mr-4">
            <v-icon>{{ $vuetify.icons.values.mdiFire }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              :class="!$route.query.sort ? 'font-weight-bold' : ''"
              >Hot</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="chooseTop">
          <v-list-item-icon class="mr-4">
            <v-icon>{{ $vuetify.icons.values.mdiFormatListNumbered }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              :class="$route.query.sort === 'top' ? 'font-weight-bold' : ''"
              >Top</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="chooseNew">
          <v-list-item-icon class="mr-4">
            <v-icon>{{ $vuetify.icons.values.mdiClockTimeOneOutline }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              :class="$route.query.sort === 'new' ? 'font-weight-bold' : ''"
              >New</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-fade-transition>

    <v-fade-transition hide-on-leave>
      <v-list v-show="selectingTime" dense>
        <v-list-item @click="chooseTimeAll">
          <v-list-item-action>
            <v-radio-group v-model="allTime">
              <v-radio value="yes" readonly />
            </v-radio-group>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>All Time</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="chooseTimeHour">
          <v-list-item-action>
            <v-radio-group v-model="hour">
              <v-radio value="yes" readonly />
            </v-radio-group>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Hour</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="chooseTimeDay">
          <v-list-item-action>
            <v-radio-group v-model="day">
              <v-radio value="yes" readonly />
            </v-radio-group>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Day</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="chooseTimeWeek">
          <v-list-item-action>
            <v-radio-group v-model="week">
              <v-radio value="yes" readonly />
            </v-radio-group>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Week</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="chooseTimeMonth">
          <v-list-item-action>
            <v-radio-group v-model="month">
              <v-radio value="yes" readonly />
            </v-radio-group>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Month</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="chooseTimeYear">
          <v-list-item-action>
            <v-radio-group v-model="year">
              <v-radio value="yes" readonly />
            </v-radio-group>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Year</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-fade-transition>
  </div>
</template>

<script>
export default {
  name: 'SortMenuContent',
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      selectingTime: false
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
  watch: {
    open(open) {
      if (!open) this.cancelSelectingTime()
    }
  },
  methods: {
    chooseHot() {
      this.$emit('selected')
      const query = Object.assign({}, this.$route.query)
      delete query.sort
      delete query.time
      try {
        this.$router.push({ path: this.$route.path, query })
      } catch (e) {}
    },
    chooseTop() {
      this.selectingTime = true
      try {
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, sort: 'top' }
        })
      } catch (e) {}
    },
    chooseNew() {
      this.$emit('selected')
      const query = Object.assign({}, this.$route.query)
      query.sort = 'new'
      delete query.time
      try {
        this.$router.push({
          path: this.$route.path,
          query
        })
      } catch (e) {}
    },
    chooseTimeAll() {
      this.$emit('selected')
      this.cancelSelectingTime()
      const query = Object.assign({}, this.$route.query)
      delete query.time
      try {
        this.$router.push({ path: this.$route.path, query })
      } catch (e) {}
    },
    chooseTimeHour() {
      this.$emit('selected')
      this.cancelSelectingTime()
      try {
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, time: 'hour' }
        })
      } catch (e) {}
    },
    chooseTimeDay() {
      this.$emit('selected')
      this.cancelSelectingTime()
      try {
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, time: 'day' }
        })
      } catch (e) {}
    },
    chooseTimeWeek() {
      this.$emit('selected')
      this.cancelSelectingTime()
      try {
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, time: 'week' }
        })
      } catch (e) {}
    },
    chooseTimeMonth() {
      this.$emit('selected')
      this.cancelSelectingTime()
      try {
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, time: 'month' }
        })
      } catch (e) {}
    },
    chooseTimeYear() {
      this.$emit('selected')
      this.cancelSelectingTime()
      try {
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, time: 'year' }
        })
      } catch (e) {}
    },
    cancelSelectingTime() {
      setTimeout(() => (this.selectingTime = false), 500)
    }
  }
}
</script>

<style scoped></style>
