<template>
  <v-chip
    v-if="!currentUser"
    outlined
    label
    small
    class="mr-1 px-2"
    nuxt
    :to="`/topic/${topic.name}`"
  >
    <span>{{ topic.capitalizedName }}</span>
  </v-chip>
  <v-menu v-else v-model="menu" :close-on-content-click="false" offset-x>
    <template v-slot:activator="{ on }">
      <v-chip
        outlined
        label
        small
        class="mr-1 px-2"
        v-on="on"
        @click.prevent="menu = true"
      >
        <span>{{ topic.capitalizedName }}</span>
      </v-chip>
    </template>

    <v-list dense>
      <v-list-item :disabled="topic.isHidden" @click="toggleFollow">
        <v-list-item-icon class="mr-2">
          <v-icon>{{ icons.plusBox }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="pr-3 font-weight-regular"
            >Follow
            <span class="font-italic">{{
              topic.capitalizedName
            }}</span></v-list-item-title
          >
        </v-list-item-content>

        <v-list-item-action class="ma-0">
          <v-checkbox v-model="topic.isFollowing" dense readonly />
        </v-list-item-action>
      </v-list-item>

      <v-list-item @click="toggleHide">
        <v-list-item-icon class="mr-2">
          <v-icon>{{ icons.eyeOff }}</v-icon>
        </v-list-item-icon>

        <v-list-item-title class="pr-3 font-weight-regular"
          >Hide Posts in
          <span class="font-italic">{{
            topic.capitalizedName
          }}</span></v-list-item-title
        >
        <v-list-item-action class="ma-0">
          <v-checkbox v-model="topic.isHidden" dense readonly />
        </v-list-item-action>
      </v-list-item>

      <v-subheader v-show="topic.isHidden"
        >Posts in&nbsp;<span class="font-italic">
          {{ topic.capitalizedName }}
        </span>
        &nbsp;will be hidden upon refresh</v-subheader
      >

      <v-list-item link nuxt :to="`/topic/${topic.name}`">
        <v-list-item-icon class="mr-2">
          <v-icon>{{ icons.openInNew }}</v-icon>
        </v-list-item-icon>

        <v-list-item-title class="pr-3 font-weight-regular"
          >View all posts in
          <span class="font-italic">{{
            topic.capitalizedName
          }}</span></v-list-item-title
        >
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mdiPlusBox, mdiEyeOff, mdiOpenInNew, mdiPlus } from '@mdi/js'
import unhideTopicGql from '../gql/unhideTopic.graphql'
import hideTopicGql from '../gql/hideTopic.graphql'
import unfollowTopicGql from '../gql/unfollowTopic.graphql'
import followTopicGql from '../gql/followTopic.graphql'
import followedTopicsGql from '../gql/followedTopics.graphql'
import topicGql from '../gql/topic.graphql'
import currentUserGql from '../gql/currentUser.graphql'

export default {
  name: 'TopicChip',
  props: {
    topicData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      subscribed: false,
      menu: false,
      icons: {
        plus: mdiPlus,
        plusBox: mdiPlusBox,
        eyeOff: mdiEyeOff,
        openInNew: mdiOpenInNew
      },
      topic: this.topicData,
      currentUser: null
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    },
    topic: {
      query: topicGql,
      variables() {
        return {
          topicName: this.topic.name
        }
      },
      skip() {
        return !this.menu
      }
    }
  },
  methods: {
    toggleFollow() {
      if (this.topic.isFollowing) this.unfollowTopic()
      else this.followTopic()
    },
    followTopic() {
      this.$apollo.mutate({
        mutation: followTopicGql,
        variables: {
          topicName: this.topic.name
        },
        refetchQueries: [{ query: followedTopicsGql }],
        update: () => (this.topic.isFollowing = true)
      })
    },
    unfollowTopic() {
      this.$apollo.mutate({
        mutation: unfollowTopicGql,
        variables: {
          topicName: this.topic.name
        },
        refetchQueries: [{ query: followedTopicsGql }],
        update: () => (this.topic.isFollowing = false)
      })
    },
    toggleHide() {
      if (this.topic.isHidden) this.unhideTopic()
      else this.hideTopic()
    },
    hideTopic() {
      this.$apollo.mutate({
        mutation: hideTopicGql,
        variables: {
          topicName: this.topic.name
        },
        refetchQueries: [{ query: followedTopicsGql }],
        update: () => {
          this.topic.isHidden = true
          this.topic.isFollowing = false
        }
      })
    },
    unhideTopic() {
      this.$apollo.mutate({
        mutation: unhideTopicGql,
        variables: {
          topicName: this.topic.name
        },
        update: () => (this.topic.isHidden = false)
      })
    }
  }
}
</script>

<style scoped></style>
