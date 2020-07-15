<template>
  <v-row justify="center">
    <v-col :cols="$device.isDesktop ? 6 : 12">
      <div class="text-h6 pt-2 pb-4 text--secondary">New Text Post</div>

      <v-text-field
        v-model="title"
        :background-color="$vuetify.theme.dark ? '' : '#F5F5F5'"
        solo
        flat
        label="Title"
        :rules="titleRules"
      />
      <client-only>
        <v-card
          class="px-4 pt-2 pb-2"
          flat
          :color="$vuetify.theme.dark ? '' : '#F5F5F5'"
        >
          <div class="overline text--secondary pb-2">TEXT POST</div>
          <Editor v-model="textContent" editable autofocus />

          <v-card-actions class="pl-0 pb-0 pt-4">
            <span v-if="$device.isDesktop" class="caption text--secondary"
              >Tip: Highlight text to use formatting</span
            >
          </v-card-actions>
        </v-card>
      </client-only>

      <div class="pt-6">
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
              selectedTopics.length > 10
          "
          @click="submitPost"
          >Post</v-btn
        >
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import Editor from '../../../components/editor/Editor'
import TopicCombobox from '~/components/TopicCombobox'
import submitPostGql from '~/gql/submitPost'
import { urlName } from '~/util/urlName'

export default {
  components: { TopicCombobox, Editor },
  beforeRouteEnter(to, from, next) {
    next((vm) => (vm.prevRoute = from))
  },
  data() {
    return {
      prevRoute: null,
      textContent: null,
      title: '',
      titleRules: [
        (v) => v.length <= 300 || 'Title must be 300 characters or less'
      ],
      selectedTopics: [],
      loading: false
    }
  },
  computed: {
    urlName() {
      return urlName(this.title)
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
            type: 'TEXT',
            textContent: this.textContent,
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
  }
}
</script>

<style scoped></style>
