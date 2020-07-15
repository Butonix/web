<template>
  <v-combobox
    ref="combobox"
    v-model="selectedTopics"
    :items="searchTopicsNames"
    label="Choose topics"
    solo
    flat
    hide-no-data
    hide-selected
    chips
    multiple
    persistent-hint
    hint="Type and press enter to add topics"
    clearable
    append-icon=""
    :search-input.sync="topicSearchText"
    :loading="$apollo.queries.searchTopics.loading"
    :rules="topicRules"
  >
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        small
        label
        @click="data.select"
        @click:close="remove(data.item)"
      >
        {{ data.item }}
      </v-chip>
    </template>

    <template v-slot:item="data">
      <v-list-item-content>
        <v-list-item-title>{{ data.item }}</v-list-item-title>
      </v-list-item-content>
    </template>
  </v-combobox>
</template>

<script>
import searchTopicsGql from '~/gql/searchTopics'
import { capitalizedName } from '~/util/capitalizedName'

export default {
  name: 'TopicCombobox',
  props: {
    prevRoute: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selectedTopics: [],
      previousTopic: null,
      topicSearchText: '',
      searchTopics: [],
      topicRules: [
        (topicNames) => {
          for (const topicName of topicNames) {
            if (!topicName.match(/^[a-z0-9 ]+$/i))
              return 'Topic names must be alphanumeric.'
          }
          return true
        },
        (topicNames) => {
          for (const topicName of topicNames) {
            if (!topicName.length > 50)
              return 'Topic names must be 50 characters or less.'
          }
          return true
        },
        (topicNames) => {
          if (topicNames.length > 10) return 'Cannot add more than 10 topics.'
          return true
        }
      ]
    }
  },
  computed: {
    previousTopicName() {
      if (this.prevRoute && this.prevRoute.name === 't-name')
        return capitalizedName(this.prevRoute.params.name)
      else return ''
    },
    searchTopicsNames() {
      return this.searchTopics.map((topic) => topic.capitalizedName)
    }
  },
  watch: {
    topicSearchText() {
      if (!this.topicSearchText) this.searchTopics = []
    },
    selectedTopics() {
      this.topicSearchText = ''
      this.$emit('input', this.selectedTopics)
    },
    previousTopicName(val) {
      if (val) {
        this.selectedTopics.unshift(val)
      }
    }
  },
  methods: {
    remove(item) {
      const index = this.selectedTopics.indexOf(item)
      if (index >= 0) this.selectedTopics.splice(index, 1)
    }
  },
  apollo: {
    searchTopics: {
      query: searchTopicsGql,
      debounce: 200,
      variables() {
        return {
          search: this.topicSearchText
        }
      },
      skip() {
        return !this.topicSearchText
      }
    }
  }
}
</script>

<style scoped></style>
