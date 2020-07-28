<template>
  <v-card
    :flat="$vuetify.theme.dark"
    :outlined="!$vuetify.theme.dark && !showViewProfileBtn"
    :width="isHover ? 400 : undefined"
    :tile="showViewProfileBtn"
    :style="{
      'background-color': $vuetify.theme.dark ? '' : '#F1F3F4',
      'border-width': '1px'
    }"
  >
    <v-list-item>
      <v-list-item-avatar size="64">
        <v-img
          v-if="user.profilePicUrl"
          alt="Profile picture"
          :src="user.profilePicUrl"
        />
        <v-icon v-else>{{ $vuetify.icons.values.mdiAccountOutline }}</v-icon>
      </v-list-item-avatar>

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

            <template
              v-if="
                showButtons && $store.state.currentUser && !user.isCurrentUser
              "
            >
              <v-tooltip bottom transition="fade-transition">
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
                <span>{{ user.isBlocking ? 'Unblock' : 'Block' }}</span>
              </v-tooltip>

              <v-tooltip bottom transition="fade-transition">
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
                <span>{{ user.isFollowing ? 'Unfollow' : 'Follow' }}</span>
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
        <v-list-item-subtitle
          class="mt-1 mb-0 caption"
          :class="lastOnlineString === 'Online' ? 'green--text' : ''"
          style="white-space: normal"
          >{{ lastOnlineString }}</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>

    <v-row align="center" justify="start" no-gutters class="px-4 pb-2">
      <v-chip
        small
        outlined
        :title="
          `${user.endorsementCount} Rocket${
            user.endorsementCount === 1 ? '' : 's'
          }`
        "
      >
        <v-icon small left>{{ $vuetify.icons.values.mdiRocket }}</v-icon>
        {{ user.endorsementCount }}
      </v-chip>

      <v-chip
        small
        outlined
        class="ml-2"
        :title="
          `${user.commentCount} Comment${user.commentCount === 1 ? '' : 's'}`
        "
      >
        <v-icon small left>{{
          $vuetify.icons.values.mdiCommentOutline
        }}</v-icon>
        {{ user.commentCount }}
      </v-chip>

      <v-chip
        small
        outlined
        class="ml-2"
        :title="`${user.postCount} Post${user.postCount === 1 ? '' : 's'}`"
      >
        <v-icon small left>{{ $vuetify.icons.values.mdiPost }}</v-icon>
        {{ user.postCount }}
      </v-chip>

      <template v-if="user.isCurrentUser && allowEdit">
        <v-spacer />

        <v-dialog
          v-model="editDialog"
          width="35%"
          :fullscreen="!$device.isDesktop"
          :transition="
            $device.isDesktop ? 'dialog-transition' : 'dialog-bottom-transition'
          "
        >
          <template v-slot:activator="{ on }">
            <v-btn text small rounded class="text--secondary" v-on="on">
              <v-icon size="20" class="mr-2">{{
                $vuetify.icons.values.mdiPencil
              }}</v-icon>
              Edit Profile
            </v-btn>
          </template>

          <v-card>
            <div class="pa-4">
              <div class="overline text--secondary">CHANGE BIO</div>
              <v-textarea
                v-model="editBio"
                label="Bio"
                solo
                flat
                no-resize
                rows="3"
                :counter="160"
              />
              <v-btn
                depressed
                rounded
                color="primary"
                class="mb-4"
                :disabled="editBio.length > 160"
                @click="changeBio"
                >Change Bio</v-btn
              >

              <v-divider />

              <div class="overline text--secondary">CHANGE AVATAR</div>
              <AvatarEditor
                :dialog-open="editDialog"
                button-text="Change Avatar"
                @finished="editDialog = false"
                @cancelled="cancelDialog"
              />
              <div class="caption text--secondary mt-3">
                Note: Changes to avatar may take some time to take effect
              </div>
            </div>

            <v-card-actions>
              <v-spacer />
              <v-btn text rounded @click="cancelDialog">Discard Changes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-row>

    <div v-if="showViewProfileBtn">
      <v-list-item nuxt :to="`/u/${user.username}`">
        <v-list-item-icon
          ><v-icon>{{
            $vuetify.icons.values.mdiOpenInNew
          }}</v-icon></v-list-item-icon
        >
        <v-list-item-content>
          <v-list-item-title>View profile</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
  </v-card>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'
import blockUserGql from '../../gql/blockUser.graphql'
import unblockUserGql from '../../gql/unblockUser.graphql'
import followUserGql from '../../gql/followUser.graphql'
import unfollowUserGql from '../../gql/unfollowUser.graphql'
import setBioGql from '../../gql/setBio.graphql'

export default {
  name: 'UserSummaryCard',
  components: { AvatarEditor: () => import('@/components/AvatarEditor') },
  props: {
    user: {
      type: Object,
      default: null
    },
    isHover: {
      type: Boolean,
      default: false
    },
    showButtons: {
      type: Boolean,
      default: true
    },
    showViewProfileBtn: {
      type: Boolean,
      default: false
    },
    allowEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editDialog: false,
      editBio: this.user.bio ? this.user.bio : ''
    }
  },
  computed: {
    lastOnlineString() {
      if (!this.user) return ''
      if (this.user.username === 'Comet') return 'Online'
      const lastLogin = new Date(this.user.lastLogin)
      const now = new Date()
      if (now - lastLogin < 15 * 60 * 1000) {
        return 'Online'
      } else {
        return 'Last online ' + formatDistanceToNowStrict(lastLogin) + ' ago'
      }
    }
  },
  methods: {
    changeBio() {
      this.editDialog = false
      this.$apollo.mutate({
        mutation: setBioGql,
        variables: {
          bio: this.editBio
        }
      })
      this.user.bio = this.editBio
    },
    cancelDialog() {
      this.editDialog = false
      this.editBio = this.user.bio
    },
    toggleBlock() {
      this.$emit('toggleblock')
      if (this.user.isBlocking) this.unblockUser()
      else this.blockUser()
    },
    blockUser() {
      this.$store.dispatch('displaySnackbar', {
        message: `Blocked ${this.user.username}`
      })
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
      this.$store.dispatch('displaySnackbar', {
        message: `Unblocked ${this.user.username}`
      })
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
