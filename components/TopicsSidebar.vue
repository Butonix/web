<template>
  <div class="sticky">
    <v-card outlined>
      <v-list
        class="sidebar"
        dense
        style="border-radius: 4px; overflow-y: auto"
        max-height="650"
      >
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
          dense
          solo-inverted
          flat
          label="Find topics"
          hide-details
          :append-icon="icons.magnify"
          class="mb-2 mx-2"
        />

        <v-divider class="mb-1" />

        <div v-if="topicSearchText">
          <v-list-item v-if="searchTopics.length === 0">
            <v-list-item-content>
              <v-list-item-title
                >No topics matching {{ topicSearchText }} found.
                <v-icon small>{{ icons.frown }}</v-icon></v-list-item-title
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
        </div>

        <div v-else-if="selected === 'Following'" style="max-height: 400px">
          <v-list-item v-if="followedTopics.length === 0">
            <v-list-item-content>
              <v-list-item-title
                >Not following any topics.
                <v-icon small>{{ icons.frown }}</v-icon></v-list-item-title
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
        </div>

        <div v-else-if="selected === 'Popular'">
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
        </div>
      </v-list>
    </v-card>

    <div class="caption mt-2 mx-2 secondary--text">
      <a href="https://discord.gg/NPCMGSm" target="_blank">Discord</a>
      <span class="mx-1">&middot;</span>
      <a href="https://github.com/comet-app" target="_blank">GitHub</a>
      <span class="mx-1">&middot;</span>
      <nuxt-link to="/content-policy" target="_blank">Content Policy</nuxt-link>
      <span class="mx-1">&middot;</span>
      <nuxt-link to="/terms-of-service" target="_blank"
        >Terms of Service</nuxt-link
      >
      <span class="mx-1">&middot;</span>
      <nuxt-link to="/privacy-policy" target="_blank">Privacy Policy</nuxt-link>
    </div>
  </div>
</template>

<script>
import { mdiEmoticonFrown, mdiMagnify } from '@mdi/js'
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
      searchTopics: [],
      icons: {
        frown: mdiEmoticonFrown,
        magnify: mdiMagnify
      }
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
      query: popularTopicsGql
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
.sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 72px;
}

.sidebar {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.sidebar::-webkit-scrollbar {
  width: 0 !important;
}
</style>
