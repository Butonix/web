<template>
  <v-menu v-model="menu" offset-y open-on-hover :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <nuxt-link :to="`/u/${userData.username}`" class="text--primary">
          <v-avatar size="32">
            <img :src="userData.profilePicUrl" />
          </v-avatar>
          <span class="ml-1" style="font-size: .875rem">
            {{ userData.username }}
          </span>
          <v-chip
            v-if="userData.tag"
            dark
            x-small
            label
            :color="userData.tagColor"
            class="ml-1"
            >{{ userData.tag }}</v-chip
          >
        </nuxt-link>
      </span>
    </template>

    <v-card style="border-radius: 10px" max-width="400">
      <div v-if="!user || $apollo.queries.user.loading" class="pa-4">
        <v-row align="center" justify="center">
          <v-progress-circular indeterminate />
        </v-row>
      </div>

      <v-list-item v-else>
        <v-list-item-avatar size="64">
          <v-img
            v-if="user.profilePicUrl"
            alt="Profile picture"
            :src="user.profilePicUrl"
          />
          <v-icon v-else>{{ $vuetify.icons.values.mdiAccountOutline }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title style="font-size: 1.25rem" class="my-0">
            <v-row no-gutters>
              <span>{{ user.username }}</span>
              <v-chip
                v-if="user.tag"
                dark
                small
                label
                :color="user.tagColor"
                class="ml-1"
                >{{ user.tag }}</v-chip
              >

              <v-spacer />

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
            </v-row>
          </v-list-item-title>
          <v-list-item-subtitle
            v-if="user.bio"
            class="mt-1 mb-0"
            style="white-space: normal"
            >{{ user.bio }}</v-list-item-subtitle
          >
          <v-list-item-subtitle class="mt-2">
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
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-menu>
</template>

<script>
import blockUserGql from '../gql/blockUser.graphql'
import unblockUserGql from '../gql/unblockUser.graphql'
import followUserGql from '../gql/followUser.graphql'
import unfollowUserGql from '../gql/unfollowUser.graphql'
import userGql from '../gql/user.graphql'

export default {
  name: 'UsernameMenu',
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      user: null,
      menu: false
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

<style scoped>
.v-menu__content {
  border-radius: 10px;
}
</style>
