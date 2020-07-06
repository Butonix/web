<template>
  <v-card outlined style="background-color: transparent;">
    <v-subheader class="ml-2"
      >TOPICS
      <span v-if="!topicSearchText" class="ml-4"
        ><span
          class="hoverable"
          :class="{ 'font-weight-bold': selected === 'Popular' }"
          @click="selected = 'Popular'"
          >Popular</span
        >
        <span v-if="currentUser">/</span>
        <span
          v-if="currentUser"
          class="hoverable"
          :class="{ 'font-weight-bold': selected === 'Following' }"
          @click="selected = 'Following'"
          >Following</span
        ></span
      >
      <span v-else class="ml-4 font-weight-bold">
        Searching
      </span>
    </v-subheader>
    <v-text-field
      v-model="topicSearchText"
      clearable
      dense
      solo-inverted
      flat
      label="Find topics"
      hide-details
      :append-icon="$vuetify.icons.values.mdiMagnify"
      class="mb-2 mx-2"
    />

    <v-divider class="mb-2" />

    <v-list
      v-if="topicSearchText"
      class="sidebar pt-0"
      dense
      style="overflow-y: auto; background-color: transparent"
    >
      <v-list-item v-if="searchTopics.length === 0">
        <v-list-item-content>
          <v-list-item-title
            >No topics matching {{ topicSearchText }} found.
            <v-icon small>{{
              $vuetify.icons.values.mdiEmoticonFrown
            }}</v-icon></v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-for="(topic, index) in searchTopics"
        :key="index"
        link
        nuxt
        :to="`/topic/${topic.name}`"
      >
        <v-list-item-content>
          <v-list-item-title>{{ topic.capitalizedName }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list
      v-else-if="selected === 'Following'"
      class="sidebar pt-0"
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

    <v-list
      v-else-if="selected === 'Popular'"
      class="sidebar pt-0"
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
  </v-card>
</template>

<script>
import followedTopicsGql from '../gql/followedTopics.graphql'
import popularTopicsGql from '../gql/popularTopics.graphql'
import searchTopicsGql from '../gql/searchTopics.graphql'
import currentUserGql from '../gql/currentUser.graphql'

export default {
  name: 'TopicsSidebar',
  data() {
    return {
      currentUser: null,
      followedTopics: [],
      popularTopics: [],
      searchTopics: []
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
    currentUser: {
      query: currentUserGql
    },
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
