<template>
  <v-menu v-model="menu" offset-y open-on-hover :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <nuxt-link :to="`/u/${userData.username}`" class="text--primary">
          <v-avatar size="28">
            <img :src="userData.profilePicUrl" />
          </v-avatar>
          <span class="ml-1">
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

    <UserSummaryCard is-hover :user="user" />
  </v-menu>
</template>

<script>
import blockUserGql from '../../gql/blockUser.graphql'
import unblockUserGql from '../../gql/unblockUser.graphql'
import followUserGql from '../../gql/followUser.graphql'
import unfollowUserGql from '../../gql/unfollowUser.graphql'
import userGql from '../../gql/user.graphql'
import UserSummaryCard from './UserSummaryCard'

export default {
  name: 'UsernameMenu',
  components: { UserSummaryCard },
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
