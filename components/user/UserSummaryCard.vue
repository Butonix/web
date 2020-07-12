<template>
  <v-card
    :flat="$vuetify.theme.dark"
    :outlined="!$vuetify.theme.dark"
    :style="
      $vuetify.theme.dark ? '' : 'background-color: #F5F5F5; border-width: 1px'
    "
    :max-width="isHover ? 400 : undefined"
  >
    <v-list-item>
      <nuxt-link :to="`/u/${user.username}`">
        <v-list-item-avatar size="64">
          <v-img
            v-if="user.profilePicUrl"
            alt="Profile picture"
            :src="user.profilePicUrl"
          />
          <v-icon v-else>{{ $vuetify.icons.values.mdiAccountOutline }}</v-icon>
        </v-list-item-avatar>
      </nuxt-link>

      <v-list-item-content>
        <v-list-item-title style="font-size: 1.43rem" class="my-0">
          <v-row no-gutters>
            <nuxt-link :to="`/u/${user.username}`" class="text--primary">{{
              user.username
            }}</nuxt-link>
            <v-chip
              v-if="user.tag"
              dark
              small
              label
              :color="user.tagColor"
              class="ml-2"
              style="border-radius: 12px !important;"
              >{{ user.tag }}</v-chip
            >

            <v-spacer />

            <template v-if="isHover && !user.isCurrentUser">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mr-2"
                    :color="user.isBlocking ? 'primary' : ''"
                    small
                    icon
                    :disabled="user.isFollowing"
                    v-on="on"
                    @click="toggleBlock"
                  >
                    <v-icon>{{
                      $vuetify.icons.values.mdiAccountCancelOutline
                    }}</v-icon>
                  </v-btn>
                </template>
                <span>Block</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    :color="user.isFollowing ? 'primary' : ''"
                    small
                    icon
                    :disabled="user.isBlocking"
                    v-on="on"
                    @click="toggleFollow"
                  >
                    <v-icon>{{
                      user.isFollowing
                        ? $vuetify.icons.values.mdiAccountCheckOutline
                        : $vuetify.icons.values.mdiAccountPlusOutline
                    }}</v-icon>
                  </v-btn>
                </template>
                <span>Follow</span>
              </v-tooltip>
            </template>
          </v-row>
        </v-list-item-title>
        <v-list-item-subtitle
          v-if="user.bio"
          class="mt-1 mb-0"
          style="white-space: normal; font-size: 1rem"
          >{{ user.bio }}</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>

    <v-row align="center" justify="start" no-gutters class="px-4 pb-2">
      <v-chip small outlined>
        <v-icon small left>{{ $vuetify.icons.values.mdiRocket }}</v-icon>
        {{ user.endorsementCount }}
      </v-chip>

      <v-chip small outlined class="ml-2">
        <v-icon small left>{{
          $vuetify.icons.values.mdiCommentOutline
        }}</v-icon>
        {{ user.commentCount }}
      </v-chip>

      <v-chip small outlined class="ml-2">
        <v-icon small left>{{ $vuetify.icons.values.mdiPost }}</v-icon>
        {{ user.postCount }}
      </v-chip>
    </v-row>
  </v-card>
</template>

<script>
import userGql from '../../gql/user.graphql'
import blockUserGql from '../../gql/blockUser.graphql'
import unblockUserGql from '../../gql/unblockUser.graphql'
import followUserGql from '../../gql/followUser.graphql'
import unfollowUserGql from '../../gql/unfollowUser.graphql'

export default {
  name: 'UserSummaryCard',
  props: {
    user: {
      type: Object,
      default: null
    },
    isHover: {
      type: Boolean,
      default: false
    }
  },
  apollo: {
    user: {
      query: userGql,
      variables() {
        return {
          username: this.userData.username
        }
      },
      skip() {
        return !this.menu
      }
    }
  },
  methods: {
    toggleBlock() {
      if (this.user.isBlocking) this.unblockUser()
      else this.blockUser()
    },
    blockUser() {
      this.user.isBlocking = true
      this.$forceUpdate()
      this.$apollo.mutate({
        mutation: blockUserGql,
        variables: {
          blockedId: this.user.id
        }
      })
    },
    unblockUser() {
      this.user.isBlocking = false
      this.$forceUpdate()
      this.$apollo.mutate({
        mutation: unblockUserGql,
        variables: {
          blockedId: this.user.id
        }
      })
    },
    toggleFollow() {
      if (this.user.isFollowing) this.unfollowUser()
      else this.followUser()
    },
    followUser() {
      this.user.isFollowing = true
      this.$forceUpdate()
      this.$apollo.mutate({
        mutation: followUserGql,
        variables: {
          followedId: this.user.id
        }
      })
    },
    unfollowUser() {
      this.user.isFollowing = false
      this.$forceUpdate()
      this.$apollo.mutate({
        mutation: unfollowUserGql,
        variables: {
          followedId: this.user.id
        }
      })
    }
  }
}
</script>

<style scoped></style>
