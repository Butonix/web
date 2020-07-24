<template>
  <v-row justify="center">
    <v-col :cols="$device.isDesktop ? 6 : 12">
      <div class="text-h6 pt-2 pb-4 text--secondary">New Image Upload</div>

      <v-text-field
        v-model="title"
        :background-color="$vuetify.theme.dark ? '' : '#F1F3F4'"
        solo
        flat
        label="Title"
        :rules="titleRules"
        :loading="detectTitleLoading"
        clearable
      />

      <v-file-input
        ref="fileInput"
        v-model="image"
        :background-color="$vuetify.theme.dark ? '' : '#F1F3F4'"
        solo
        flat
        label="Choose an image"
      />

      <img
        v-if="image"
        ref="imagePreview"
        style="max-width: 100%"
        class="pb-6"
      />

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
              !image ||
              !uploadValid
          "
          @click="submitPost"
          >Post</v-btn
        >
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { urlName } from '~/util/urlName'
import submitPostGql from '~/gql/submitPost'

export default {
  data() {
    return {
      prevRoute: null,
      title: '',
      titleRules: [
        (v) => v.length <= 300 || 'Title must be 300 characters or less'
      ],
      image: null,
      uploadRules: [
        (v) => (v && v.size < 4 * 1024 * 1024) || 'Image must be 4MB or less',
        (v) =>
          (v && (v.type === 'image/jpeg' || v.type === 'image/png')) ||
          'Image must be PNG or JPEG'
      ],
      selectedTopics: [],
      loading: false,
      detectTitleLoading: false
    }
  },
  computed: {
    urlName() {
      return urlName(this.title)
    },
    uploadValid() {
      return this.$refs.fileInput.valid
    }
  },
  watch: {
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
  beforeRouteEnter(to, from, next) {
    next((vm) => (vm.prevRoute = from))
  },
  methods: {
    async submitPost() {
      this.loading = true

      const fd = new FormData()
      fd.append('image', this.image)

      const response = await this.$axios.$post('/upload', fd, {
        headers: {
          authorization: `Bearer ${this.$apolloHelpers.getToken()}`
        }
      })

      if (response.error) {
        await this.$store.dispatch('displaySnackbar', {
          message: response.error
        })
        this.loading = false
        return
      }

      if (!response.link) {
        await this.$store.dispatch('displaySnackbar', {
          message: 'Upload failed'
        })
        this.loading = false
        return
      }

      try {
        await this.$apollo.mutate({
          mutation: submitPostGql,
          variables: {
            title: this.title,
            type: 'IMAGE',
            link: response.link,
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
    title: 'New Image Upload'
  }
}
</script>

<style scoped></style>
