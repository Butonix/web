<template>
  <v-list>
    <v-list-item v-if="canShare" @click="share">
      <v-list-item-icon>
        <v-icon>{{ $vuetify.icons.values.mdiShareOutline }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Share</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item @click="copyLink">
      <v-list-item-icon>
        <v-icon>{{ $vuetify.icons.values.mdiContentCopy }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Copy Link</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      v-if="!$device.isDesktop"
      nuxt
      :to="`/u/${post.author.username}`"
    >
      <v-list-item-avatar v-if="post.author.profilePicUrl" size="24">
        <v-avatar>
          <v-img width="24" height="24" :src="post.author.profilePicUrl" />
        </v-avatar>
      </v-list-item-avatar>

      <v-list-item-icon v-else>
        <v-icon>{{ $vuetify.icons.values.mdiAccountOutline }}</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title
          >{{ post.author.username }}'s profile</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <template v-if="$store.state.currentUser">
      <v-list-item @click="toggleHide">
        <v-list-item-icon>
          <v-icon>{{
            hidden
              ? $vuetify.icons.values.mdiEye
              : $vuetify.icons.values.mdiEyeOff
          }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{
            hidden ? 'Post will be hidden upon refresh' : 'Hide'
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item :disabled="reported" @click="reportPost">
        <v-list-item-icon>
          <v-icon>{{ $vuetify.icons.values.mdiAlertOctagonOutline }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{
            reported ? 'Reported' : 'Report'
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
import hidePostGql from '../../gql/hidePost.graphql'
import unhidePostGql from '../../gql/unhidePost.graphql'
import reportPostGql from '../../gql/reportPost.graphql'
import { urlName } from '~/util/urlName'

export default {
  name: 'PostOptionsContent',
  props: {
    post: {
      type: Object,
      required: true
    },
    hidden: {
      type: Boolean,
      default: false
    },
    reported: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    canShare() {
      if (!process.client) return false
      return !!navigator.share
    },
    urlName() {
      return urlName(this.post.title)
    }
  },
  methods: {
    share() {
      this.$emit('selected')
      navigator.share({
        title: `"${this.post.title}" on Comet`,
        url: `https://www.getcomet.net/p/${this.post.id}/${this.urlName}`
      })
    },
    copyLink() {
      this.$emit('selected')
      this.$copyText(
        `https://www.getcomet.net/p/${this.post.id}/${this.urlName}`
      )
      this.$store.dispatch('displaySnackbar', {
        message: 'Copied link to clipboard',
        success: true
      })
    },
    async toggleHide() {
      if (this.hidden) await this.unhidePost()
      else await this.hidePost()
    },
    async hidePost() {
      this.$emit('hidden')
      this.$emit('selected')
      await this.$apollo.mutate({
        mutation: hidePostGql,
        variables: {
          postId: this.post.id
        }
      })
    },
    async unhidePost() {
      this.$emit('unhidden')
      this.$emit('selected')
      await this.$apollo.mutate({
        mutation: unhidePostGql,
        variables: {
          postId: this.post.id
        }
      })
    },
    async reportPost() {
      this.$emit('selected')
      const confirmed = window.confirm(
        "Report this post for violating Comet's content policy?"
      )
      if (!confirmed) return
      this.$emit('reported')
      await this.$apollo.mutate({
        mutation: reportPostGql,
        variables: {
          postId: this.post.id
        }
      })
    }
  }
}
</script>

<style scoped></style>
