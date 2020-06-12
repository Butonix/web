<template>
  <nuxt-link
    v-if="
      !currentUser ||
        (currentUser && currentUser.username === userData.username)
    "
    :to="`/user/@${userData.username}`"
    class="caption font-weight-medium hoverable"
    ><span v-if="userData.title" class="overline font-weight-bold"
      >[{{ userData.title }}] </span
    >@{{ userData.username }}</nuxt-link
  >
  <v-menu v-else v-model="menu" :close-on-content-click="false" offset-x>
    <template v-slot:activator="{ on }">
      <a class="caption font-weight-medium hoverable" v-on="on"
        ><span v-if="userData.title" class="overline font-weight-bold"
          >[{{ userData.title }}] </span
        >@{{ userData.username }}</a
      >
    </template>

    <v-list v-if="user" dense>
      <!--<v-list-item :disabled="user.isBlocking" @click="toggleFollow">
        <v-list-item-icon class="mr-2">
          <v-icon>{{ icons.plusBox }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="pr-3 font-weight-regular"
            >Follow
            <span class="font-italic">{{
              userData.username
            }}</span></v-list-item-title
          >
        </v-list-item-content>

        <v-list-item-action class="ma-0">
          <v-checkbox v-model="user.isFollowing" dense readonly />
        </v-list-item-action>
      </v-list-item>-->

      <v-list-item @click="toggleBlock">
        <v-list-item-icon class="mr-2">
          <v-icon>{{ icons.eyeOff }}</v-icon>
        </v-list-item-icon>

        <v-list-item-title class="pr-3 font-weight-regular"
          >Block
          <span class="font-italic"
            >@{{ userData.username }}</span
          ></v-list-item-title
        >
        <v-list-item-action class="ma-0">
          <v-checkbox v-model="user.isBlocking" dense readonly />
        </v-list-item-action>
      </v-list-item>

      <v-subheader v-show="user.isBlocking"
        >Posts and Comments from&nbsp;<span class="font-italic">
          @{{ userData.username }}
        </span>
        &nbsp;will be hidden upon refresh</v-subheader
      >

      <v-list-item link nuxt :to="`/user/@${userData.username}`">
        <v-list-item-icon class="mr-2">
          <v-icon>{{ icons.openInNew }}</v-icon>
        </v-list-item-icon>

        <v-list-item-title class="pr-3 font-weight-regular"
          >View <span class="font-italic">{{ userData.username }}</span
          >'s profile</v-list-item-title
        >
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mdiPlusBox, mdiEyeOff, mdiOpenInNew } from '@mdi/js'
import gql from 'graphql-tag'
import currentUserGql from '../gql/currentUser.graphql'
import blockUserGql from '../gql/blockUser.graphql'
import unblockUserGql from '../gql/unblockUser.graphql'
// import followUserGql from '../gql/followUser.graphql'
// import unfollowUserGql from '../gql/unfollowUser.graphql'

export default {
  name: 'Username',
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    menu: false,
    currentUser: null,
    user: null,
    icons: {
      plusBox: mdiPlusBox,
      eyeOff: mdiEyeOff,
      openInNew: mdiOpenInNew
    }
  }),
  apollo: {
    currentUser: {
      query: currentUserGql
    },
    user: {
      query: gql`
        query($username: String!) {
          user(username: $username) {
            username
            id
            isBlocking
          }
        }
      `,
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
    /* toggleFollow() {
      if (this.user.isFollowing) this.unfollowUser()
      else this.followUser()
    },
    followUser() {
      this.$apollo.mutate({
        mutation: followUserGql,
        variables: {
          followedId: this.user.id
        },
        update: () => (this.user.isFollowing = true)
      })
    },
    unfollowUser() {
      this.$apollo.mutate({
        mutation: unfollowUserGql,
        variables: {
          followedId: this.user.id
        },
        update: () => (this.user.isFollowing = false)
      })
    }, */
    toggleBlock() {
      if (this.user.isBlocking) this.unblockUser()
      else this.blockUser()
    },
    blockUser() {
      this.$apollo.mutate({
        mutation: blockUserGql,
        variables: {
          blockedId: this.user.id
        },
        update: () => {
          this.user.isBlocking = true
          // this.user.isFollowing = false
        }
      })
    },
    unblockUser() {
      this.$apollo.mutate({
        mutation: unblockUserGql,
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
