<template>
  <span>
    <v-btn
      small
      rounded
      text
      class="mr-2 ml-0 text--secondary"
      :to="`/p/${post.id}/${urlName}`"
      nuxt
      :title="
        `${post.commentCount} Comment${post.commentCount === 1 ? '' : 's'}`
      "
    >
      <v-icon size="20" class="mr-2">{{
        $vuetify.icons.values.mdiCommentOutline
      }}</v-icon>
      {{ post.commentCount }}
      <span v-if="newCommentCount > 0" class="primary--text">
        &nbsp;(+{{ newCommentCount }})</span
      >
    </v-btn>

    <v-btn
      small
      rounded
      text
      class="mr-2 ml-0 "
      :class="post.isEndorsed ? '' : 'text--secondary'"
      :color="post.isEndorsed ? 'primary' : ''"
      :title="
        `${post.endorsementCount} Rocket${
          post.endorsementCount === 1 ? '' : 's'
        }`
      "
      @click.stop.prevent="toggleEndorsement"
    >
      <v-icon size="20" class="mr-2">{{
        $vuetify.icons.values.mdiRocket
      }}</v-icon>
      {{ post.endorsementCount }}
    </v-btn>
  </span>
</template>

<script>
import togglePostEndorsementGql from '~/gql/togglePostEndorsement'
import { urlName } from '~/util/urlName'

export default {
  name: 'PostActions',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    newCommentCount() {
      if (!this.post.postView) return -1
      return this.post.commentCount - this.post.postView.lastCommentCount
    },
    urlName() {
      if (!this.post) return ''
      return urlName(this.post.title)
    }
  },
  methods: {
    async toggleEndorsement() {
      if (!this.$store.state.currentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to rocket this post'
        })
        return
      }

      if (this.post.author.isCurrentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Cannot rocket your own post'
        })
        return
      }

      if (this.post.isEndorsed) {
        this.post.isEndorsed = false
        this.post.endorsementCount--
      } else {
        this.post.isEndorsed = true
        this.post.endorsementCount++
      }
      await this.$apollo.mutate({
        mutation: togglePostEndorsementGql,
        variables: {
          postId: this.post.id
        }
      })
    }
  }
}
</script>

<style scoped></style>
