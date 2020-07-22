<template>
  <v-card
    outlined
    :style="
      $vuetify.theme.dark
        ? 'background-color: transparent'
        : 'background-color: #F1F3F4'
    "
    style="border-width: 1px"
  >
    <div class="overline text--secondary ml-3 mt-2" style="line-height: 1.5rem">
      TOPICS
    </div>
    <v-tabs
      v-model="tab"
      grow
      :show-arrows="false"
      background-color="transparent"
    >
      <v-tab
        style="letter-spacing: normal; text-transform: none; font-size: 1rem"
      >
        <v-icon class="mr-2">{{ $vuetify.icons.values.mdiNewspaper }}</v-icon>
        My Topics
      </v-tab>
      <v-tab
        style="letter-spacing: normal; text-transform: none; font-size: 1rem"
      >
        <v-icon class="mr-2">{{ $vuetify.icons.values.mdiTrendingUp }}</v-icon>
        Popular
      </v-tab>
      <v-tab
        style="letter-spacing: normal; text-transform: none; font-size: 1rem"
      >
        <v-icon class="mr-2">{{ $vuetify.icons.values.mdiMagnify }}</v-icon>
        Find
      </v-tab>
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
            :to="`/t/${topic.name}`"
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
            :to="`/t/${topic.name}`"
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
        <div class="px-3 pt-3">
          <v-text-field
            v-model="topicSearchText"
            solo
            flat
            dense
            hide-details
            :background-color="$vuetify.theme.dark ? '' : '#DEE1E6'"
            label="Search topics"
          />
        </div>

        <v-list color="transparent">
          <v-list-item
            v-for="topic in searchTopicsResult"
            :key="topic.name"
            :to="`/t/${topic.name}`"
          >
            <v-list-item-content>
              <v-list-item-title>{{ topic.capitalizedName }}</v-list-item-title>
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
      topicSearchText: '',
      tab: 0
    }
  },
  computed: {
    searchTopicsResult() {
      if (!this.topicSearchText) return []
      else return this.searchTopics
    }
  },
  watch: {
    followedTopics() {
      if (this.followedTopics.length > 0) this.tab = 0
      else this.tab = 1
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

<style>
.sidebar {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.sidebar::-webkit-scrollbar {
  width: 0 !important;
}

.v-slide-group__next,
.v-slide-group__prev {
  display: none !important;
}
</style>
