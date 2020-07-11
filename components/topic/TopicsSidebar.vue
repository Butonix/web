<template>
  <v-card
    outlined
    :style="
      $vuetify.theme.dark
        ? 'background-color: transparent'
        : 'background-color: #F5F5F5'
    "
    style="border-width: 1px"
  >
    <v-tabs v-model="tab" background-color="transparent">
      <v-tab>Followed</v-tab>
      <v-tab>Popular</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" style="background-color: transparent">
      <v-tab-item>
        <v-list
          class="sidebar"
          dense
          style="overflow-y: auto; background-color: transparent"
        >
          <v-list-item v-if="followedTopics.length === 0">
            <v-list-item-content>
              <v-list-item-title
                >Not following any topics.
                <v-icon small
                  >{{ $vuetify.icons.values.mdiOpenInNew }}-frown</v-icon
                ></v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="(topic, index) in followedTopics"
            :key="index"
            link
            nuxt
            :to="`/topic/${topic.name}`"
          >
            <v-list-item-content>
              <v-list-item-title>{{ topic.capitalizedName }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ topic.postCount }} post{{
                  topic.postCount === 1 ? '' : 's'
                }}
                today</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-tab-item>

      <v-tab-item>
        <v-list
          class="sidebar"
          dense
          style="overflow-y: auto; background-color: transparent"
        >
          <v-list-item v-if="popularTopics.length === 0">
            <v-list-item-content>
              <v-list-item-title
                >No popular topics today.
                <v-icon small>{{
                  $vuetify.icons.values.mdiEmoticonFrown
                }}</v-icon></v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="(topic, index) in popularTopics"
            :key="index"
            link
            nuxt
            :to="`/topic/${topic.name}`"
          >
            <v-list-item-content>
              <v-list-item-title>{{ topic.capitalizedName }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ topic.postCount }} post{{
                  topic.postCount === 1 ? '' : 's'
                }}
                today</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import followedTopicsGql from '../../gql/followedTopics.graphql'
import popularTopicsGql from '../../gql/popularTopics.graphql'
import searchTopicsGql from '../../gql/searchTopics.graphql'

export default {
  name: 'TopicsSidebar',
  data() {
    return {
      followedTopics: [],
      popularTopics: [],
      searchTopics: [],
      tab: 0
    }
  },
  computed: {
    selected: {
      get() {
        return this.$store.state.topicSidebarSelected
      },
      set(val) {
        this.$store.commit('setTopicSidebarSelected', val)
      }
    },
    topicSearchText: {
      get() {
        return this.$store.state.topicSidebarSearchText
      },
      set(val) {
        this.$store.commit('setTopicSidebarSearchText', val)
      }
    }
  },
  apollo: {
    followedTopics: {
      query: followedTopicsGql
    },
    popularTopics: {
      query: popularTopicsGql,
      fetchPolicy: 'cache-and-network'
    },
    searchTopics: {
      query: searchTopicsGql,
      debounce: 300,
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

<style scoped>
.sidebar {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.sidebar::-webkit-scrollbar {
  width: 0 !important;
}
</style>
