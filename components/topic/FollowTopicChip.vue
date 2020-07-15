<template>
  <v-chip
    close
    :close-icon="
      following ? $vuetify.icons.values.mdiCheck : $vuetify.icons.values.mdiPlus
    "
    class="mr-2 mb-2"
    @click="followTopic"
    @click:close="followTopic"
    >{{ capitalizedName }}</v-chip
  >
</template>

<script>
import followTopicGql from '../../gql/followTopic.graphql'

export default {
  name: 'FollowTopicChip',
  props: {
    topicName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      following: false
    }
  },
  computed: {
    capitalizedName() {
      return this.topicName
        .replace(/_/g, ' ')
        .split(' ')
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
        )
        .join(' ')
    }
  },
  methods: {
    async followTopic() {
      if (this.following) return
      this.following = true
      await this.$apollo.mutate({
        mutation: followTopicGql,
        variables: {
          topicName: this.topicName
        }
      })
    }
  }
}
</script>

<style scoped></style>
