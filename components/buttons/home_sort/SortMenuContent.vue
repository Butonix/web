<template>
  <div>
    <v-fade-transition hide-on-leave>
      <v-list v-show="!selectingTime">
        <v-list-item @click="chooseHot">
          <v-list-item-icon>
            <v-icon>{{ $vuetify.icons.values.mdiFire }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              :class="
                !$route.path.includes('/top') &&
                !$route.path.includes('/new') &&
                !$route.path.includes('/mostcomments')
                  ? 'font-weight-bold'
                  : ''
              "
              >Hot</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="chooseTop">
          <v-list-item-icon>
            <v-icon>{{ $vuetify.icons.values.mdiFormatListNumbered }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              :class="$route.path.includes('/top') ? 'font-weight-bold' : ''"
              >Top</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="chooseNew">
          <v-list-item-icon>
            <v-icon>{{ $vuetify.icons.values.mdiClockTimeOneOutline }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              :class="$route.path.includes('/new') ? 'font-weight-bold' : ''"
              >New</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="chooseComments">
          <v-list-item-icon>
            <v-icon>{{
              $vuetify.icons.values.mdiCommentMultipleOutline
            }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              :class="
                $route.path.includes('/mostcomments') ? 'font-weight-bold' : ''
              "
              >Comments</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-divider />
        <v-list>
          <TypeMenuContent />
        </v-list>
      </v-list>
    </v-fade-transition>

    <v-fade-transition hide-on-leave>
      <v-list v-show="selectingTime">
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
import TypeMenuContent from '../type/TypeMenuContent'
export default {
  name: 'SortMenuContent',
  components: { TypeMenuContent },
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
      try {
        this.$router.push({
          path: (
            this.$route.path
              .replace('/hot', '')
              .replace('/top', '')
              .replace('/new', '')
              .replace('/mostcomments', '')
              .replace('/hour', '')
              .replace('/day', '')
              .replace('/week', '')
              .replace('/month', '')
              .replace('/year', '')
              .replace('/all', '') + '/'
          ).replace('//', '/')
        })
      } catch (e) {}
    },
    chooseTop() {
      this.selectingTime = true
      try {
        this.$router.push({
          path: (
            this.$route.path
              .replace('/hot', '')
              .replace('/top', '')
              .replace('/new', '')
              .replace('/mostcomments', '')
              .replace('/hour', '')
              .replace('/day', '')
              .replace('/week', '')
              .replace('/month', '')
              .replace('/year', '')
              .replace('/all', '') + '/top/day'
          ).replace('//', '/')
        })
      } catch (e) {}
    },
    chooseNew() {
      this.$emit('selected')
      try {
        this.$router.push({
          path: (
            this.$route.path
              .replace('/hot', '')
              .replace('/top', '')
              .replace('/new', '')
              .replace('/mostcomments', '')
              .replace('/hour', '')
              .replace('/day', '')
              .replace('/week', '')
              .replace('/month', '')
              .replace('/year', '')
              .replace('/all', '') + '/new'
          ).replace('//', '/')
        })
      } catch (e) {}
    },
    chooseComments() {
      this.selectingTime = true
      try {
        this.$router.push({
          path: (
            this.$route.path
              .replace('/hot', '')
              .replace('/top', '')
              .replace('/new', '')
              .replace('/mostcomments', '')
              .replace('/hour', '')
              .replace('/day', '')
              .replace('/week', '')
              .replace('/month', '')
              .replace('/year', '')
              .replace('/all', '') + '/mostcomments/day'
          ).replace('//', '/')
        })
      } catch (e) {}
    },
    chooseTimeAll() {
      this.$emit('selected')
      this.cancelSelectingTime()
      try {
        this.$router.push({ params: { time: 'all' } })
      } catch (e) {}
    },
    chooseTimeHour() {
      this.$emit('selected')
      this.cancelSelectingTime()
      try {
        this.$router.push({ params: { time: 'hour' } })
      } catch (e) {}
    },
    chooseTimeDay() {
      this.$emit('selected')
      this.cancelSelectingTime()
      try {
        this.$router.push({ params: { time: 'day' } })
      } catch (e) {}
    },
    chooseTimeWeek() {
      this.$emit('selected')
      this.cancelSelectingTime()
      try {
        this.$router.push({ params: { time: 'week' } })
      } catch (e) {}
    },
    chooseTimeMonth() {
      this.$emit('selected')
      this.cancelSelectingTime()
      try {
        this.$router.push({ params: { time: 'month' } })
      } catch (e) {}
    },
    chooseTimeYear() {
      this.$emit('selected')
      this.cancelSelectingTime()
      try {
        this.$router.push({ params: { time: 'year' } })
      } catch (e) {}
    },
    cancelSelectingTime() {
      setTimeout(() => (this.selectingTime = false), 500)
    }
  }
}
</script>

<style scoped></style>
