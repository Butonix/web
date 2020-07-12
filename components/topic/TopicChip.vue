<template>
  <v-menu
    v-if="$device.isDesktop"
    v-model="menu"
    :close-on-content-click="false"
    offset-y
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ on }">
      <v-chip outlined label small class="mr-1 px-2" v-on="on">
        <span>{{ topicData.capitalizedName }}</span>
      </v-chip>
    </template>

    <TopicChipContent :topic="topicData" />
  </v-menu>

  <v-bottom-sheet v-else v-model="menu">
    <template v-slot:activator="{ on }">
      <v-chip outlined label small class="mr-1 px-2" v-on="on">
        <span>{{ topicData.capitalizedName }}</span>
      </v-chip>
    </template>

    <TopicChipContent :topic="topic" />
  </v-bottom-sheet>
</template>

<script>
import topicGql from '../../gql/topic.graphql'
import TopicChipContent from './TopicChipContent'

export default {
  name: 'TopicChip',
  components: { TopicChipContent },
  props: {
    topicData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      menu: false,
      topic: this.topicData
    }
  },
  apollo: {
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
  }
}
</script>

<style scoped></style>
