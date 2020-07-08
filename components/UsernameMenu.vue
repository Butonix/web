<template>
  <v-menu offset-y open-on-hover>
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <nuxt-link :to="`/u/${user.username}`" class="text--primary">
          <v-avatar size="32">
            <img :src="user.profilePicUrl" />
          </v-avatar>
          <span class="ml-1" style="font-size: .875rem">
            {{ user.username }}
          </span>
          <v-chip
            v-if="user.tag"
            dark
            x-small
            label
            :color="user.tagColor"
            class="ml-1"
            >{{ user.tag }}</v-chip
          >
        </nuxt-link>
      </span>
    </template>

    <v-card max-width="400">
      <ApolloQuery
        :query="require('../gql/user.graphql')"
        :variables="{ username: user.username }"
      >
        <template v-slot="{ result: { loading, error, data } }">
          <div v-if="!data || !data.user" class="pa-4">
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
                  >{{ user.tag }}</v-chip
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
                  <v-icon small left>{{
                    $vuetify.icons.values.mdiPost
                  }}</v-icon>
                  {{ data.user.postCount }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </ApolloQuery>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'UsernameMenu',
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
