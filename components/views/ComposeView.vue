<template>
  <v-form v-model="valid">
    <v-row>
      <v-col>
        <v-text-field
          v-model="title"
          filled
          :label="currentUser ? 'Title' : 'Must log in to create a post'"
          :disabled="!currentUser"
          clearable
          :loading="detectTitleLoading"
        />
        <v-tabs v-model="tab" class="mb-2" background-color="transparent">
          <v-tab>Text Post</v-tab>
          <v-tab>Link Post</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" style="background-color: transparent">
          <v-tab-item class="pb-7">
            <TextEditor
              v-model="textContent"
              not-logged-in-label="Must log in to create a post"
            />
          </v-tab-item>

          <v-tab-item class="pb-7">
            <v-text-field
              v-model="link"
              filled
              hide-details
              :label="currentUser ? 'Link URL' : 'Must log in to create a post'"
              :disabled="!currentUser"
              clearable
            />
          </v-tab-item>
        </v-tabs-items>

        <v-combobox
          ref="combobox"
          v-model="selectedTopics"
          :disabled="!currentUser"
          :items="searchTopicsNames"
          label="Choose topics"
          filled
          hide-no-data
          hide-selected
          chips
          multiple
          dense
          persistent-hint
          hint="Select topics, or type and press enter to add a new topic"
          clearable
          append-icon=""
          :search-input.sync="topicSearchText"
          :loading="$apollo.queries.searchTopics.loading"
          :rules="topicRules"
        >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              color="black"
              small
              label
              @click="data.select"
              @click:close="remove(data.item)"
            >
              {{ data.item }}
            </v-chip>
          </template>

          <template v-slot:item="data">
            <v-list-item-content>
              <v-list-item-title>{{ data.item }}</v-list-item-title>
            </v-list-item-content>
          </template>
        </v-combobox>

        <v-row class="ma-0" align="end">
          <v-spacer />
          <div v-if="submitPostErr" class="error--text mr-2">
            {{ submitPostErr }}
          </div>
          <v-btn
            depressed
            color="primary"
            :loading="loading"
            :disabled="
              !title ||
                selectedTopics.length <= 0 ||
                !currentUser ||
                !$refs.combobox.valid
            "
            @click="submitPost"
            >Submit</v-btn
          >
        </v-row>
        <v-row class="caption mx-0 mt-1">
          <v-spacer />
          <div class="text--secondary">
            Please review our
            <nuxt-link to="/content-policy" target="_blank"
              >Content Policy</nuxt-link
            >
            before posting
          </div>
        </v-row>
      </v-col>
      <v-col v-if="$device.isDesktop">
        <div v-if="tab === 0">
          <div class="title mb-1">Preview</div>
          <v-card flat>
            <div class="pt-2 px-4">{{ title ? title : 'Title' }}</div>
            <v-divider class="mt-2 mb-1" />
            <div class="pb-1 pt-1 px-4 body-2" v-html="markedText" />
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import marked from 'marked'
import gql from 'graphql-tag'
import isUrl from 'is-url'
import xss from 'xss'
import TextEditor from '../TextEditor'
import submitPostGql from '../../gql/submitPost.graphql'
import currentUserGql from '../../gql/currentUser.graphql'
import searchTopicsGql from '../../gql/searchTopics.graphql'
import topicGql from '../../gql/topic.graphql'
import { escapeHtml } from '../../util/escapeHtml'

export default {
  name: 'ComposeView',
  components: { TextEditor },
  data: () => ({
    tab: null,
    title: '',
    textContent: '',
    link: '',
    valid: false,
    selectedTopics: [],
    currentUser: null,
    loading: false,
    detectTitleLoading: false,
    prevRoute: null,
    previousTopic: null,
    topicSearchText: '',
    searchTopics: [],
    submitPostErr: '',
    topicRules: [
      (topicNames) => {
        for (const topicName of topicNames) {
          if (!topicName.match(/^[a-z0-9 ]+$/i))
            return 'Topic names must be alphanumeric.'
        }
        return true
      },
      (topicNames) => {
        for (const topicName of topicNames) {
          if (!topicName.length > 50)
            return 'Topic names must be 50 characters or less.'
        }
        return true
      },
      (topicNames) => {
        if (topicNames.length > 10) return 'Cannot add more than 10 topics.'
        return true
      }
    ]
  }),
  computed: {
    markedText() {
      return this.textContent
        ? xss(marked(escapeHtml(this.textContent)))
        : marked('(No content written)')
    },
    previousTopicName() {
      if (this.prevRoute && this.prevRoute.name === 'Topic')
        return this.prevRoute.params.topicName
      else return ''
    },
    searchTopicsNames() {
      return this.searchTopics.map((topic) => topic.capitalizedName)
    },
    urlName() {
      return this.title
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/\W/g, '')
    }
  },
  watch: {
    async link() {
      if (!this.link || !isUrl(this.link) || this.title) {
        this.detectTitleLoading = false
        return
      }
      this.detectTitleLoading = true
      this.title = (
        await this.$apollo.query({
          query: gql`
            query($url: String!) {
              getTitleAtUrl(url: $url)
            }
          `,
          variables: {
            url: this.link
          }
        })
      ).data.getTitleAtUrl
      this.detectTitleLoading = false
    },
    topicSearchText() {
      if (!this.topicSearchText) this.searchTopics = []
    },
    selectedTopics() {
      this.topicSearchText = ''
    }
  },
  methods: {
    async submitPost() {
      this.loading = true
      try {
        await this.$apollo.mutate({
          mutation: submitPostGql,
          variables: {
            title: this.title,
            type: this.tab === 0 ? 'TEXT' : 'LINK',
            link: this.link ? this.link : undefined,
            textContent: this.textContent ? this.textContent : undefined,
            topics: this.selectedTopics
          },
          update: (store, { data: { submitPost } }) => {
            this.$router.push(`/post/${submitPost.id}/${this.urlName}`)
          }
        })
      } catch (e) {
        this.submitPostErr = e.message.split('GraphQL error: ')[1]
      }
      this.loading = false
    },
    remove(item) {
      const index = this.selectedTopics.indexOf(item)
      if (index >= 0) this.selectedTopics.splice(index, 1)
    }
  },
  head: {
    title: 'New Post'
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => (vm.prevRoute = from))
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    },
    previousTopic: {
      query: topicGql,
      variables() {
        return {
          topicName: this.previousTopicName
        }
      },
      skip() {
        return !this.previousTopicName
      },
      update(data) {
        if (!this.selectedTopics.includes(data.topic.capitalizedName)) {
          this.selectedTopics.unshift(data.topic.capitalizedName)
        }
        return data.topic
      }
    },
    searchTopics: {
      query: searchTopicsGql,
      debounce: 300,
      variables() {
        return {
          search: this.topicSearchText
        }
      },
      skip() {
        return !this.topicSearchText
      }
    }
  }
}
</script>

<style scoped></style>
