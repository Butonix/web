<template>
  <v-row justify="center">
    <v-col :cols="$device.isDesktop ? 6 : 12">
      <div class="text-h6 pt-2 pb-4 text--secondary">New Link Post</div>

      <v-text-field
        v-model="title"
        :background-color="$vuetify.theme.dark ? '' : '#F5F5F5'"
        solo
        flat
        label="Title"
        :rules="titleRules"
        :loading="detectTitleLoading"
        clearable
      />

      <v-text-field
        v-model="link"
        :background-color="$vuetify.theme.dark ? '' : '#F5F5F5'"
        solo
        flat
        label="Link URL"
      />

      <div>
        <TopicCombobox v-model="selectedTopics" :prev-route="prevRoute" />
      </div>

      <v-row no-gutters>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="
            !title ||
              title.length > 300 ||
              selectedTopics.length === 0 ||
              selectedTopics.length > 10 ||
              !link
          "
          @click="submitPost"
          >Post</v-btn
        >
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import isUrl from 'is-url'
import gql from 'graphql-tag'
import TopicCombobox from '~/components/TopicCombobox'
import { urlName } from '~/util/urlName'
import submitPostGql from '~/gql/submitPost'

export default {
  components: { TopicCombobox },
  data() {
    return {
      prevRoute: null,
      title: '',
      link: '',
      titleRules: [
        (v) => v.length <= 300 || 'Title must be 300 characters or less'
      ],
      selectedTopics: [],
      loading: false,
      detectTitleLoading: false
    }
  },
  computed: {
    urlName() {
      return urlName(this.title)
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
            type: 'LINK',
            link: this.link,
            topics: this.selectedTopics
          },
          update: (store, { data: { submitPost } }) => {
            this.$router.push(`/p/${submitPost.id}/${this.urlName}`)
          }
        })
      } catch (e) {
        await this.$store.dispatch('displaySnackbar', {
          message: e.message.split('GraphQL error: ')[1]
        })
      }
      this.loading = false
    }
  },
  head: {
    title: 'New Link Post'
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => (vm.prevRoute = from))
  }
}
</script>

<style scoped></style>
