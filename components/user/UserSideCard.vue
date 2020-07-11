<template>
  <ApolloQuery
    v-if="$store.state.currentUser"
    :query="require('../../gql/user.graphql')"
    :variables="{ username: $store.state.currentUser.username }"
  >
    <template v-slot="{ result: { loading, error, data } }">
      <UserSummaryCard :user="data ? data.user : null" />
    </template>
  </ApolloQuery>

  <v-card
    v-else
    :flat="$vuetify.theme.dark"
    :outlined="!$vuetify.theme.dark"
    :style="
      $vuetify.theme.dark ? '' : 'background-color: #F5F5F5; border-width: 1px'
    "
  >
    <v-card-title style="word-break: normal"
      >Login to enjoy all of Comet's features!</v-card-title
    >
    <v-card-subtitle
      >Create posts and comments, follow topics, fine-tune the content you see,
      and more!</v-card-subtitle
    >
    <v-card-actions>
      <v-spacer />
      <v-btn text>Login</v-btn>
      <v-btn text>Sign Up</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import UserSummaryCard from './UserSummaryCard'
export default {
  name: 'UserSideCard',
  components: { UserSummaryCard }
}
</script>

<style scoped></style>
