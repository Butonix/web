<template>
  <v-list class="py-0">
    <v-list-item link nuxt :to="`/t/${topic.name}`">
      <v-list-item-icon>
        <v-icon>{{ $vuetify.icons.values.mdiOpenInNew }}</v-icon>
      </v-list-item-icon>

      <v-list-item-title class="pr-3 font-weight-regular"
        >View
        <span class="font-italic">{{
          topic.capitalizedName
        }}</span></v-list-item-title
      >
    </v-list-item>

    <v-list-item :disabled="isHidden" @click="toggleFollow">
      <v-list-item-icon>
        <v-icon>{{ $vuetify.icons.values.mdiPlusBox }}</v-icon>
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
        <v-checkbox v-model="isFollowing" :disabled="isHidden" dense readonly />
      </v-list-item-action>
    </v-list-item>

    <v-list-item :disabled="isFollowing" @click="toggleHide">
      <v-list-item-icon>
        <v-icon>{{ $vuetify.icons.values.mdiEyeOff }}</v-icon>
      </v-list-item-icon>

      <v-list-item-title class="pr-3 font-weight-regular"
        >Hide
        <span class="font-italic">{{
          topic.capitalizedName
        }}</span></v-list-item-title
      >
      <v-list-item-action class="ma-0">
        <v-checkbox v-model="isHidden" :disabled="isFollowing" dense readonly />
      </v-list-item-action>
    </v-list-item>

    <v-subheader v-show="isHidden"
      >Posts in&nbsp;<span class="font-italic">
        {{ topic.capitalizedName }}
      </span>
      &nbsp;will be hidden upon refresh</v-subheader
    >
  </v-list>
</template>

<script>
import followTopicGql from '../../gql/followTopic.graphql'
import followedTopicsGql from '../../gql/followedTopics.graphql'
import unfollowTopicGql from '../../gql/unfollowTopic.graphql'
import hideTopicGql from '../../gql/hideTopic.graphql'
import unhideTopicGql from '../../gql/unhideTopic.graphql'

export default {
  name: 'TopicChipContent',
  props: {
    topic: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isFollowing: this.topic.isFollowing,
      isHidden: this.topic.isHidden
    }
  },
  methods: {
    toggleFollow() {
      if (this.isFollowing) this.unfollowTopic()
      else this.followTopic()
    },
    followTopic() {
      this.$apollo.mutate({
        mutation: followTopicGql,
        variables: {
          topicName: this.topic.name
        },
        refetchQueries: [{ query: followedTopicsGql }],
        update: () => (this.isFollowing = true)
      })
    },
    unfollowTopic() {
      this.$apollo.mutate({
        mutation: unfollowTopicGql,
        variables: {
          topicName: this.topic.name
        },
        refetchQueries: [{ query: followedTopicsGql }],
        update: () => (this.isFollowing = false)
      })
    },
    toggleHide() {
      if (this.isHidden) this.unhideTopic()
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
          this.isHidden = true
          this.isFollowing = false
        }
      })
    },
    unhideTopic() {
      this.$apollo.mutate({
        mutation: unhideTopicGql,
        variables: {
          topicName: this.topic.name
        },
        update: () => (this.isHidden = false)
      })
    }
  }
}
</script>

<style scoped></style>
