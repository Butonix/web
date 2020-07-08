<template>
  <v-card
    outlined
    style="background-color: transparent; border-width: 1px; border-radius: 10px"
    :to="currentUser ? `/u/${currentUser.username}` : '/login'"
  >
    <ApolloQuery
      v-if="currentUser"
      :query="require('../gql/user.graphql')"
      :variables="{ username: currentUser.username }"
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
    <v-card-title v-else>Not logged in</v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'UserSideCard',
  props: {
    currentUser: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
