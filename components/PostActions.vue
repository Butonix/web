<template>
  <span class="text--secondary">
    <Username :user-data="post.author" />
    <span
      class="ml-1 caption font-weight-medium"
      :title="editedTimeSince ? `Edited ${editedTimeSince} ago` : ''"
      >{{ timeSince }}{{ $device.isDesktop ? ' ago' : ''
      }}{{ editedTimeSince ? '*' : '' }}</span
    >

    <!--Comment-->
    <v-btn
      :to="`/post/${post.id}/${urlName}`"
      nuxt
      text
      x-small
      class="font-weight-medium caption text--secondary"
      style="text-transform: none; font-size: 12px"
    >
      <span v-if="$device.isDesktop" class="mr-1 text--secondary">
        {{ post.commentCount }}
        {{ `Comment${post.commentCount === 1 ? '' : 's'}` }}
        {{ newCommentsCount > 0 ? `(${newCommentsCount} new)` : '' }}
      </span>

      <span v-else>
        {{ post.commentCount }}
        {{ newCommentsCount > 0 ? `(+${newCommentsCount})` : '' }}
        &nbsp;
      </span>

      <v-icon x-small class="text--secondary">{{
        $vuetify.icons.values.mdiCommentOutline
      }}</v-icon>
    </v-btn>

    <!--Endorse-->
    <v-btn
      text
      x-small
      class="font-weight-medium caption"
      :style="post.isEndorsed ? 'color: var(--v-primary-base)' : ''"
      style="text-transform: none; font-size: 12px"
      :disabled="currentUser && post.author.isCurrentUser"
      @click="toggleEndorsement"
    >
      <span
        v-if="$device.isDesktop"
        class="mr-1"
        :class="
          post.isEndorsed
            ? ''
            : currentUser && post.author.isCurrentUser
            ? ''
            : 'text--secondary'
        "
      >
        {{ post.endorsementCount }} Endorsement{{
          post.endorsementCount === 1 ? '' : 's'
        }}
      </span>

      <span
        v-else
        :class="
          post.isEndorsed
            ? ''
            : currentUser && post.author.isCurrentUser
            ? ''
            : 'text--secondary'
        "
      >
        {{ post.endorsementCount }}&nbsp;
      </span>

      <v-icon
        x-small
        :style="post.isEndorsed ? 'color: var(--v-primary-base)' : ''"
        :class="post.isEndorsed ? '' : 'text--secondary'"
        >{{ $vuetify.icons.values.mdiRocket }}</v-icon
      >
    </v-btn>

    <!--Share-->
    <v-btn
      text
      x-small
      class="font-weight-medium caption"
      style="text-transform: none; font-size: 12px"
      @click.prevent="sharePost"
    >
      <span v-if="$device.isDesktop" class="mr-1 text--secondary">
        Share
      </span>

      <v-icon x-small class="text--secondary">{{
        $vuetify.icons.values.mdiShareOutline
      }}</v-icon>
    </v-btn>

    <span v-if="$device.isDesktop">
      <!--Hide-->
      <v-btn
        v-if="!sticky && currentUser && !post.author.isCurrentUser"
        text
        x-small
        class="font-weight-medium caption"
        style="text-transform: none; font-size: 12px"
        @click="toggleHide"
      >
        <span v-if="$device.isDesktop" class="mr-1 text--secondary">
          {{ hidden ? 'Unhide' : 'Hide' }}
        </span>

        <v-icon x-small class="text--secondary">{{
          hidden
            ? $vuetify.icons.values.mdiEye
            : $vuetify.icons.values.mdiEyeOff
        }}</v-icon>
      </v-btn>

      <!--Report-->
      <v-menu v-if="!sticky && currentUser && !post.author.isCurrentUser">
        <template v-slot:activator="{ on }">
          <v-btn
            text
            x-small
            class="font-weight-medium caption"
            style="text-transform: none; font-size: 12px"
            :disabled="reported"
            v-on="on"
          >
            <span class="mr-1" :class="reported ? '' : 'text--secondary'">
              {{ reported ? 'Reported' : 'Report' }}
            </span>
            <v-icon x-small :class="reported ? '' : 'text--secondary'">{{
              $vuetify.icons.values.mdiAlertOctagonOutline
            }}</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-subheader
            >Please report only if this post violates our&nbsp;
            <nuxt-link to="/content-policy" target="_blank"
              >Content Policy</nuxt-link
            ></v-subheader
          >
          <v-list-item @click="reportPost">
            <v-list-item-icon class="mr-3">
              <v-icon>{{
                $vuetify.icons.values.mdiAlertOctagonOutline
              }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{
              reported ? 'Reported' : 'Report'
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!--Delete-->
      <v-menu v-if="!sticky && currentUser && post.author.isCurrentUser">
        <template v-slot:activator="{ on }">
          <v-btn
            text
            x-small
            class="font-weight-medium caption"
            style="text-transform: none; font-size: 12px"
            :disabled="deleted"
            v-on="on"
          >
            <span class="mr-1" :class="deleted ? '' : 'text--secondary'">
              {{ deleted ? 'Deleted' : 'Delete' }}
            </span>
            <v-icon x-small :class="deleted ? '' : 'text--secondary'">{{
              $vuetify.icons.values.mdiTrashCan
            }}</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-subheader>Are you sure you want to delete this post?</v-subheader>
          <v-list-item @click="deletePost">
            <v-list-item-icon class="mr-3">
              <v-icon>{{ $vuetify.icons.values.mdiTrashCan }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{
              deleted ? 'Deleted' : 'Delete'
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </span>

    <span v-else>
      <v-menu v-if="!sticky && currentUser && !post.author.isCurrentUser">
        <template v-slot:activator="{ on }">
          <v-btn
            text
            x-small
            class="font-weight-medium caption"
            style="text-transform: none; font-size: 12px"
            v-on="on"
          >
            <v-icon x-small>{{ $vuetify.icons.values.mdiDotsVertical }}</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item @click="toggleHide">
            <v-list-item-icon class="mr-3">
              <v-icon>{{
                hidden
                  ? $vuetify.icons.values.mdiEye
                  : $vuetify.icons.values.mdiEyeOff
              }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{
              hidden ? 'Unhide' : 'Hide'
            }}</v-list-item-title>
          </v-list-item>

          <v-list-item :disabled="reported" @click="reportPost">
            <v-list-item-icon class="mr-3">
              <v-icon>{{
                $vuetify.icons.values.mdiAlertOctagonOutline
              }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{
              reported ? 'Reported' : 'Report'
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu v-if="!sticky && currentUser && post.author.isCurrentUser">
        <template v-slot:activator="{ on }">
          <v-btn
            text
            x-small
            class="font-weight-medium caption"
            style="text-transform: none; font-size: 12px"
            v-on="on"
          >
            <v-icon x-small>{{ $vuetify.icons.values.mdiDotsVertical }}</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item :disabled="deleted" @click="deletePost">
            <v-list-item-icon class="mr-3">
              <v-icon>{{ $vuetify.icons.values.mdiTrashCan }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{
              deleted ? 'Deleted' : 'Delete'
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </span>
  </span>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'
import togglePostEndorsementGql from '../gql/togglePostEndorsement.graphql'
import currentUserGql from '../gql/currentUser.graphql'
import hidePostGql from '../gql/hidePost.graphql'
import unhidePostGql from '../gql/unhidePost.graphql'
import reportPostGql from '../gql/reportPost.graphql'
import deletePostGql from '../gql/deletePost.graphql'
import Username from './Username'

export default {
  name: 'PostActions',
  components: { Username },
  props: {
    post: {
      type: Object,
      required: true
    },
    sticky: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hidden: this.post.isHidden,
      currentUser: null,
      reported: false,
      deleted: false
    }
  },
  computed: {
    urlName() {
      return this.post.title
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/\W/g, '')
    },
    timeSince() {
      return formatDistanceToNowStrict(new Date(this.post.createdAt))
    },
    editedTimeSince() {
      if (!this.post.editedAt) return ''
      return formatDistanceToNowStrict(new Date(this.post.editedAt))
    },
    newCommentsCount() {
      if (!this.post.postView) return 0
      return this.post.commentCount - this.post.postView.lastCommentCount
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    }
  },
  methods: {
    async deletePost() {
      if (this.currentUser.id !== this.post.author.id) return
      this.deleted = true
      await this.$apollo.mutate({
        mutation: deletePostGql,
        variables: { postId: this.post.id }
      })
    },
    async reportPost() {
      if (!this.$device.isDesktop) {
        if (!process.client) return
        const confirmed = window.confirm(
          "Please report this post only if it violates Comet's content policy."
        )
        if (!confirmed) return
      }

      this.reported = true
      await this.$apollo.mutate({
        mutation: reportPostGql,
        variables: { postId: this.post.id }
      })
    },
    async toggleEndorsement() {
      if (!this.currentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to rocket this post'
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
    },
    toggleHide() {
      if (this.hidden) this.unhidePost()
      else this.hidePost()
    },
    hidePost() {
      this.hidden = true
      this.$apollo.mutate({
        mutation: hidePostGql,
        variables: {
          postId: this.post.id
        }
      })
    },
    unhidePost() {
      this.hidden = false
      this.$apollo.mutate({
        mutation: unhidePostGql,
        variables: {
          postId: this.post.id
        }
      })
    },
    sharePost() {
      if (!process.client) return
      const url = `https://getcomet.net/post/${this.post.id}/${this.urlName}`
      if (navigator.share) {
        navigator.share({
          title: `"${this.post.title}" on Comet`,
          text: `"${this.post.title}" on Comet`,
          url
        })
      } else {
        this.$copyText(url)
        this.$store.dispatch('displaySnackbar', { message: 'Copied post link' })
      }
    }
  }
}
</script>

<style scoped></style>
