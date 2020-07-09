<template>
  <v-card
    v-if="$store.state.currentUser"
    :flat="$vuetify.theme.dark"
    :outlined="!$vuetify.theme.dark"
    style="border-radius: 10px"
    :style="
      $vuetify.theme.dark ? '' : 'background-color: #FAFAFA; border-width: 1px'
    "
    :to="
      $store.state.currentUser
        ? `/u/${$store.state.currentUser.username}`
        : '/login'
    "
  >
    <ApolloQuery
      :query="require('../gql/user.graphql')"
      :variables="{ username: $store.state.currentUser.username }"
    >
      <template v-slot="{ result: { loading, error, data } }">
        <div v-if="!data" class="pa-4">
          <v-row align="center" justify="center">
            <v-progress-circular indeterminate />
          </v-row>
        </div>

        <v-list-item v-else>
          <v-list-item-avatar size="64">
            <v-img
              v-if="data.user.profilePicUrl"
              alt="Profile picture"
              :src="data.user.profilePicUrl"
            />
            <v-icon v-else>{{
              $vuetify.icons.values.mdiAccountOutline
            }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title style="font-size: 1.25rem" class="my-0">
              <span>{{ data.user.username }}</span>
              <v-chip
                v-if="data.user.tag"
                dark
                small
                label
                :color="data.user.tagColor"
                class="ml-1"
                >{{ data.user.tag }}</v-chip
              >
            </v-list-item-title>
            <v-list-item-subtitle
              v-if="data.user.bio"
              class="mt-1 mb-0"
              style="white-space: normal"
              >{{ data.user.bio }}</v-list-item-subtitle
            >
            <v-list-item-subtitle class="mt-2">
              <v-chip small outlined>
                <v-icon small left>{{
                  $vuetify.icons.values.mdiRocket
                }}</v-icon>
                {{ data.user.endorsementCount }}
              </v-chip>

              <v-chip small outlined class="ml-2">
                <v-icon small left>{{
                  $vuetify.icons.values.mdiCommentOutline
                }}</v-icon>
                {{ data.user.commentCount }}
              </v-chip>

              <v-chip small outlined class="ml-2">
                <v-icon small left>{{ $vuetify.icons.values.mdiPost }}</v-icon>
                {{ data.user.postCount }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </ApolloQuery>
  </v-card>

  <v-card
    v-else
    :flat="$vuetify.theme.dark"
    :outlined="!$vuetify.theme.dark"
    style="border-radius: 10px"
    :style="
      $vuetify.theme.dark ? '' : 'background-color: #FAFAFA; border-width: 1px'
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
export default {
  name: 'UserSideCard'
}
</script>

<style scoped></style>
