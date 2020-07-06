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
import TopicsSidebar from '../../components/TopicsSidebar'

export default {
  components: { TopicsSidebar }
}
</script>

<style scoped></style>
