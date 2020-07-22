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
import { capitalizedName } from '~/util/capitalizedName'

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
      if (this.topicName === 'nba') return 'NBA'
      else if (this.topicName === 'nfl') return 'NFL'
      return capitalizedName(this.topicName)
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
