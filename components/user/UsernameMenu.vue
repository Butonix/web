<template>
  <v-menu
    v-if="$device.isDesktop"
    v-model="menu"
    offset-y
    open-on-hover
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <Username :user-data="userData" />
      </span>
    </template>

    <UserSummaryCard v-if="user" is-hover :user="user" />
    <v-card v-else width="400">
      <div class="pa-4">
        <v-row align="center" justify="center">
          <v-progress-circular indeterminate />
        </v-row>
      </div>
    </v-card>
  </v-menu>

  <v-bottom-sheet v-else v-model="menu">
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <Username :user-data="userData" />
      </span>
    </template>

    <UserSummaryCard v-if="user" show-view-profile-btn :user="user" />
    <v-card v-else>
      <div class="pa-4">
        <v-row align="center" justify="center">
          <v-progress-circular indeterminate />
        </v-row>
      </div>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
import blockUserGql from '../../gql/blockUser.graphql'
import unblockUserGql from '../../gql/unblockUser.graphql'
import followUserGql from '../../gql/followUser.graphql'
import unfollowUserGql from '../../gql/unfollowUser.graphql'
import userGql from '../../gql/user.graphql'
import UserSummaryCard from './UserSummaryCard'
import Username from './Username'

export default {
  name: 'UsernameMenu',
  components: { Username, UserSummaryCard },
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
    doNothing() {},
    handleClick() {
      if (this.$device.isDesktop) {
        this.$router.push(`/u/${this.userData.username}`)
      }
    },
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
