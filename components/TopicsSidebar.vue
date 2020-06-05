<template>
  <v-list dense style="border-radius: 4px">
    <v-subheader class="ml-2"
      >TOPICS
      <span class="ml-4"
        ><span
          class="hoverable"
          :class="{ 'font-weight-bold': selected === 'Following' }"
          @click="selected = 'Following'"
          >Following</span
        >
        /
        <span
          class="hoverable"
          :class="{ 'font-weight-bold': selected === 'Popular' }"
          @click="selected = 'Popular'"
          >Popular</span
        ></span
      ></v-subheader
    >
    <v-text-field
      dense
      solo-inverted
      flat
      label="Find topics"
      hide-details
      append-icon="mdi-magnify"
      class="mb-2 mx-2"
    />

    <v-divider class="mb-1" />

    <div v-if="selected === 'Following'">
      <v-list-item v-if="followedTopics.length === 0">
        <v-list-item-content>
          <v-list-item-title
            >Not following any topics.
            <v-icon small>mdi-emoticon-frown</v-icon></v-list-item-title
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
        </v-list-item-content>
      </v-list-item>
    </div>
  </v-list>
</template>

<script>
import followedTopicsGql from '../gql/followedTopics.graphql'
import popularTopicsGql from '../gql/popularTopics.graphql'

export default {
  name: 'TopicsSidebar',
  data() {
    return {
      followedTopics: [],
      popularTopics: [],
      selected: 'Following'
    }
  },
  apollo: {
    followedTopics: {
      query: followedTopicsGql
    },
    popularTopics: {
      query: popularTopicsGql
    }
  }
}
</script>

<style scoped></style>
