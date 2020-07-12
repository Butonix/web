<template>
  <UserSummaryCard v-if="user" :user="user" />

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
    <v-card-subtitle style="font-size: .93rem"
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
import userGql from '../../gql/user.graphql'
import UserSummaryCard from './UserSummaryCard'

export default {
  name: 'UserSideCard',
  components: { UserSummaryCard },
  data() {
    return {
      user: null
    }
  },
  apollo: {
    user: {
      query: userGql,
      variables() {
        return {
          username: this.$store.state.currentUser.username
        }
      },
      skip() {
        return !this.$store.state.currentUser
      }
    }
  }
}
</script>

<style scoped></style>
