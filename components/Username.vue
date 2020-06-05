<template>
  <nuxt-link
    v-if="
      !currentUser || (currentUser && currentUser.username === user.username)
    "
    :to="`/user/${user.username}`"
    class="caption font-weight-medium hoverable"
    >@{{ user.username }}</nuxt-link
  >
  <v-menu v-else v-model="menu" :close-on-content-click="false" offset-x>
    <template v-slot:activator="{ on }">
      <a class="caption font-weight-medium hoverable" v-on="on"
        >@{{ user.username }}</a
      >
    </template>

    <v-list dense>
      <v-list-item :disabled="user.isBlocking" @click="toggleFollow">
        <v-list-item-icon class="mr-2">
          <v-icon>mdi-plus-box</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="pr-3 font-weight-regular"
            >Follow
            <span class="font-italic">{{
              user.username
            }}</span></v-list-item-title
          >
        </v-list-item-content>

        <v-list-item-action class="ma-0">
          <v-checkbox v-model="user.isFollowing" dense readonly />
        </v-list-item-action>
      </v-list-item>

      <v-list-item @click="toggleBlock">
        <v-list-item-icon class="mr-2">
          <v-icon>mdi-eye-off</v-icon>
        </v-list-item-icon>

        <v-list-item-title class="pr-3 font-weight-regular"
          >Hide Posts and Comments by
          <span class="font-italic"
            >@{{ user.username }}</span
          ></v-list-item-title
        >
        <v-list-item-action class="ma-0">
          <v-checkbox v-model="user.isBlocking" dense readonly />
        </v-list-item-action>
      </v-list-item>

      <v-subheader v-show="user.isBlocking"
        >Posts and Comments by<span
          class="font-italic"
          style="white-space: pre"
        >
          @{{ user.username }}
        </span>
        will be hidden upon refresh</v-subheader
      >

      <v-list-item link nuxt :to="`/user/${user.username}`">
        <v-list-item-icon class="mr-2">
          <v-icon>mdi-open-in-new</v-icon>
        </v-list-item-icon>

        <v-list-item-title class="pr-3 font-weight-regular"
          >View <span class="font-italic">{{ user.username }}</span
          >'s profile</v-list-item-title
        >
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import gql from 'graphql-tag'
import currentUserGql from '../gql/currentUser.graphql'

const followUser = gql`
  mutation($followedId: ID!) {
    followUser(followedId: $followedId)
  }
`

const unfollowUser = gql`
  mutation($followedId: ID!) {
    unfollowUser(followedId: $followedId)
  }
`

const blockUser = gql`
  mutation($blockedId: ID!) {
    blockUser(blockedId: $blockedId)
  }
`

const unblockUser = gql`
  mutation($blockedId: ID!) {
    unblockUser(blockedId: $blockedId)
  }
`

export default {
  name: 'Username',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    menu: false,
    currentUser: null
  }),
  apollo: {
    currentUser: {
      query: currentUserGql
    }
  },
  methods: {
    toggleFollow() {
      if (this.user.isFollowing) this.unfollowUser()
      else this.followUser()
    },
    followUser() {
      this.$apollo.mutate({
        mutation: followUser,
        variables: {
          followedId: this.user.id
        },
        update: () => (this.user.isFollowing = true)
      })
    },
    unfollowUser() {
      this.$apollo.mutate({
        mutation: unfollowUser,
        variables: {
          followedId: this.user.id
        },
        update: () => (this.user.isFollowing = false)
      })
    },
    toggleBlock() {
      if (this.user.isBlocking) this.unblockUser()
      else this.blockUser()
    },
    blockUser() {
      this.$apollo.mutate({
        mutation: blockUser,
        variables: {
          blockedId: this.user.id
        },
        update: () => {
          this.user.isBlocking = true
          this.user.isFollowing = false
        }
      })
    },
    unblockUser() {
      this.$apollo.mutate({
        mutation: unblockUser,
        variables: {
          blockedId: this.user.id
        },
        update: () => (this.user.isBlocking = false)
      })
    }
  }
}
</script>

<style scoped></style>
