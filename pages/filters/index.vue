<template>
  <v-row justify="center">
    <v-col :cols="$device.isDesktop ? 6 : 12">
      <v-tabs
        v-model="tab"
        grow
        :show-arrows="false"
        background-color="transparent"
      >
        <v-tab
          style="letter-spacing: normal; text-transform: none; font-size: 1rem"
        >
          <v-icon class="mr-2">{{
            $vuetify.icons.values.mdiAccountCancelOutline
          }}</v-icon>
          Blocked Users</v-tab
        >
        <v-tab
          style="letter-spacing: normal; text-transform: none; font-size: 1rem"
        >
          <v-icon class="mr-2">{{ $vuetify.icons.values.mdiNewspaper }}</v-icon>
          Blocked Planets</v-tab
        >
        <v-tab
          style="letter-spacing: normal; text-transform: none; font-size: 1rem"
        >
          <v-icon class="mr-2">{{ $vuetify.icons.values.mdiPost }}</v-icon>
          Hidden Posts</v-tab
        >
      </v-tabs>

      <v-tabs-items
        v-model="tab"
        class="mt-2"
        style="background-color: transparent"
      >
        <v-tab-item eager>
          <div v-if="blockedUsers.length > 0">
            <DynamicScroller
              page-mode
              :items="blockedUsers"
              :min-item-size="54"
            >
              <template v-slot="{ item, index, active }">
                <DynamicScrollerItem
                  :item="item"
                  :active="active"
                  :index="index"
                  :size-dependencies="[item.bio]"
                >
                  <div class="pb-3">
                    <UserSummaryCard
                      :user="item"
                      :index="index"
                      :active="active"
                      @toggleblock="updateBlockedUsers"
                    />
                  </div>
                </DynamicScrollerItem>
              </template>
            </DynamicScroller>
          </div>
          <v-list v-else>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Not blocking any users.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>

        <v-tab-item eager>
          <v-list v-if="hiddenTopics.length > 0">
            <v-list-item v-for="topic in hiddenTopics" :key="topic.name">
              <v-list-item-content>
                <v-list-item-title>{{
                  topic.capitalizedName
                }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  aria-label="Unhide Topic"
                  text
                  @click="toggleHide(topic)"
                  >{{ topic.isHidden ? 'Unhide' : 'Hide' }}</v-btn
                >
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-list v-else>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Not hiding any topics.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>

        <v-tab-item eager>
          <div v-if="hiddenPosts.length > 0">
            <DynamicScroller page-mode :items="hiddenPosts" :min-item-size="54">
              <template v-slot="{ item, index, active }">
                <DynamicScrollerItem
                  :item="item"
                  :active="active"
                  :index="index"
                  :size-dependencies="[item.title, item.textContent]"
                >
                  <div class="pb-3">
                    <Post
                      :post="item"
                      :index="index"
                      :active="active"
                      @togglehidden="filterPosts"
                    />
                  </div>
                </DynamicScrollerItem>
              </template>
            </DynamicScroller>
          </div>
          <v-list v-else>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Not hiding any posts.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
</template>

<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import blockedUsersGql from '../../gql/blockedUsers.graphql'
import unblockUserGql from '../../gql/unblockUser.graphql'
import blockedPlanetsGql from '../../gql/blockedPlanets.graphql'
import unblockPlanetGql from '../../gql/unblockPlanet.graphql'
import hiddenPostsGql from '../../gql/hiddenPosts.graphql'
import Post from '@/components/post/Post'
import UserSummaryCard from '@/components/user/UserSummaryCard'

export default {
  components: { UserSummaryCard, Post, DynamicScroller, DynamicScrollerItem },
  data() {
    return {
      tab: null,
      blockedPlanets: [],
      blockedUsers: [],
      hiddenPosts: []
    }
  },
  apollo: {
    hiddenTopics: {
      query: blockedPlanetsGql,
      fetchPolicy: 'cache-and-network'
    },
    blockedUsers: {
      query: blockedUsersGql,
      fetchPolicy: 'cache-and-network'
    },
    hiddenPosts: {
      query: hiddenPostsGql,
      fetchPolicy: 'cache-and-network'
    }
  },
  methods: {
    updateBlockedUsers() {
      this.$apollo.provider.defaultClient.cache.writeQuery({
        query: blockedUsersGql,
        data: { blockedUsers: this.blockedUsers.filter((u) => !u.isBlocking) }
      })
    },
    filterPosts() {
      this.$apollo.provider.defaultClient.cache.writeQuery({
        query: hiddenPostsGql,
        data: { hiddenPosts: this.hiddenPosts.filter((p) => p.isHidden) }
      })
    },
    unblockPlanet(planet) {
      this.$store.dispatch('displaySnackbar', {
        message: `Unblocked p/${planet.name}`
      })
      this.$apollo.mutate({
        mutation: unblockPlanetGql,
        variables: {
          planetName: planet.name
        },
        update: () => (planet.blocked = false)
      })
    },
    unblockUser(user) {
      this.$store.dispatch('displaySnackbar', {
        message: `Unblocked ${user.username}`
      })
      this.$apollo.mutate({
        mutation: unblockUserGql,
        variables: {
          blockedId: user.id
        },
        update: () => (user.isBlocking = false)
      })
    }
  }
}
</script>

<style scoped></style>
