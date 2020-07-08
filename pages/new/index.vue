<template>
  <v-container fluid>
    <v-form v-model="valid">
      <v-row>
        <v-col>
          <v-text-field
            v-model="title"
            filled
            :label="
              $store.state.currentUser
                ? 'Title'
                : 'Must log in to create a post'
            "
            :disabled="!$store.state.currentUser"
            clearable
            :loading="detectTitleLoading"
            :rules="titleRules"
          />
          <v-tabs v-model="tab" class="mb-2" background-color="transparent">
            <v-tab>Text Post</v-tab>
            <v-tab>Link Post</v-tab>
            <v-tab>Image Upload</v-tab>
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
                :label="
                  $store.state.currentUser
                    ? 'Link URL'
                    : 'Must log in to create a post'
                "
                :disabled="!$store.state.currentUser"
                clearable
              />
            </v-tab-item>

            <v-tab-item class="pb-7">
              <v-file-input
                ref="fileInput"
                v-model="image"
                class="mt-0"
                label="Choose an image"
                :rules="uploadRules"
              />
            </v-tab-item>
          </v-tabs-items>

          <v-combobox
            ref="combobox"
            v-model="selectedTopics"
            :disabled="!$store.state.currentUser"
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
            <div
              v-if="submitPostErr"
              class="error--text body-2 font-weight-medium mr-2"
            >
              {{ submitPostErr }}
            </div>
            <v-btn
              aria-label="Submit Post"
              depressed
              color="primary"
              :loading="loading"
              :disabled="
                !title ||
                  selectedTopics.length <= 0 ||
                  !$store.state.currentUser ||
                  !$refs.combobox.valid ||
                  !uploadValid ||
                  !valid
              "
              @click="submitPost"
              >Submit</v-btn
            >
          </v-row>
          <v-row class="caption mx-0 mt-1">
            <v-spacer />
            <div class="text--secondary">
              Please review our
              <nuxt-link to="/content" target="_blank"
                >Content Policy</nuxt-link
              >
              before posting
            </div>
          </v-row>
        </v-col>
        <v-col v-if="$device.isDesktop">
          <div v-show="tab === 0">
            <div class="title mb-1">Preview</div>
            <v-card flat>
              <div class="pt-2 px-4">{{ title ? title : 'Title' }}</div>
              <v-divider class="mt-2 mb-1" />
              <div class="pb-1 pt-1 px-4 body-2" v-html="markedText" />
            </v-card>
          </div>
          <div v-show="tab === 2">
            <img ref="imagePreview" style="max-height: 500px" />
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import marked from 'marked'
import gql from 'graphql-tag'
import isUrl from 'is-url'
import xss from 'xss'
import TextEditor from '../../components/TextEditor'
import submitPostGql from '../../gql/submitPost.graphql'
import searchTopicsGql from '../../gql/searchTopics.graphql'
import topicGql from '../../gql/topic.graphql'
import { escapeHtml } from '../../util/escapeHtml'

export default {
  components: { TextEditor },
  data: () => ({
    tab: 0,
    title: '',
    textContent: '',
    link: '',
    valid: false,
    selectedTopics: [],
    loading: false,
    detectTitleLoading: false,
    prevRoute: null,
    previousTopic: null,
    topicSearchText: '',
    searchTopics: [],
    submitPostErr: '',
    image: null,
    titleRules: [
      (v) => !!v || 'Title is required',
      (v) => v.length <= 300 || 'Title must be 300 characters or less'
    ],
    uploadRules: [
      (v) => !!v || 'Image is required',
      (v) => (v && v.size < 4 * 1024 * 1024) || 'Image must be 4MB or less',
      (v) =>
        (v && (v.type === 'image/jpeg' || v.type === 'image/png')) ||
        'Image must be PNG or JPEG'
    ],
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
    uploadValid() {
      if (this.tab !== 2 || !this.$refs.fileInput) return true
      return this.$refs.fileInput.valid
    },
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
    },
    image() {
      if (!this.image) {
        this.$refs.imagePreview.src = ''
        return
      }
      const reader = new FileReader()
      reader.onload = (ev) => (this.$refs.imagePreview.src = ev.target.result)
      reader.readAsDataURL(this.image)
    }
  },
  methods: {
    async submitPost() {
      this.loading = true

      if (this.tab === 2) {
        // IMAGE UPLOAD
        const fd = new FormData()
        fd.append('image', this.image)

        const response = await this.$axios.$post('/upload', fd, {
          headers: {
            authorization: `Bearer ${this.$apolloHelpers.getToken()}`
          }
        })

        if (response.error) {
          this.submitPostErr = response.error
          this.loading = false
          return
        }

        if (!response.link) {
          this.submitPostErr = 'Upload failed'
          this.loading = false
          return
        }

        this.link = response.link
      }

      try {
        let type = 'TEXT'
        if (this.tab === 0) type = 'TEXT'
        else if (this.tab === 1) type = 'LINK'
        else if (this.tab === 2) type = 'IMAGE'
        await this.$apollo.mutate({
          mutation: submitPostGql,
          variables: {
            title: this.title,
            type,
            link:
              this.link && (this.tab === 1 || this.tab === 2)
                ? this.link
                : undefined,
            textContent:
              this.textContent && this.tab === 0 ? this.textContent : undefined,
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
      debounce: 200,
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
