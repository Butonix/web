<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <TopicsSidebar />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TopicsSidebar from '../TopicsSidebar'
export default {
  name: 'TopicsView',
  components: { TopicsSidebar }
}
</script>

<style scoped></style>
