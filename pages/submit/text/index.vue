<template>
  <div>
    <v-text-field
      v-model="title"
      :background-color="$vuetify.theme.dark ? '' : '#F1F3F4'"
      solo
      flat
      label="Title"
      :rules="titleRules"
      clearable
    />

    <v-btn depressed color="primary" @click="openDialog">
      <v-icon class="mr-2">{{ $vuetify.icons.values.mdiPencil }}</v-icon>
      Open Editor
    </v-btn>

    <div v-if="!isEditorEmpty" class="pt-6" v-html="textContent" />

    <client-only>
      <v-dialog
        v-if="$store.state.currentUser"
        v-model="dialog"
        :retain-focus="false"
        persistent
        width="50%"
        :fullscreen="!$device.isDesktop"
        :transition="
          $device.isDesktop ? 'dialog-transition' : 'dialog-bottom-transition'
        "
      >
        <v-card
          :tile="!$device.isDesktop"
          :min-height="$device.isDesktop ? '400' : ''"
        >
          <div
            style="display: flex"
            :style="{
              'background-color': $vuetify.theme.dark ? '#202124' : '#F1F3F4',
              'border-bottom-width': '1px',
              'border-bottom-color': 'rgba(0, 0, 0, 0.12)',
              'border-bottom-style': $vuetify.theme.dark ? 'none' : 'solid'
            }"
          >
            <v-btn
              text
              tile
              class="flex-grow-1"
              height="50"
              @click="closeDialog"
            >
              <v-icon class="mr-2">{{
                $vuetify.icons.values.mdiCloseCircleOutline
              }}</v-icon>
              Discard
            </v-btn>
            <v-btn
              text
              tile
              class="flex-grow-1"
              height="50"
              @click="hideDialog"
            >
              <v-icon class="mr-2">{{
                $vuetify.icons.values.mdiCheckCircleOutline
              }}</v-icon>
              Done
            </v-btn>
          </div>

          <div style="font-size: 1rem">
            <Editor
              v-model="textContent"
              editable
              autofocus
              :style="$device.isDesktop ? 'min-height: 296px' : ''"
              style="overflow-y: auto"
              class="pa-2"
            />
          </div>
        </v-card>
      </v-dialog>
    </client-only>

    <v-row no-gutters class="mt-4">
      <PlanetSelector v-model="planet" :prev-route="prevRoute" />
      <v-btn
        class="ml-4"
        depressed
        color="primary"
        :loading="loading"
        :disabled="!title || title.length > 300 || !planet"
        height="48"
        @click="submitPost"
        >Post</v-btn
      >
    </v-row>
  </div>
</template>

<script>
import submitPostGql from '~/gql/submitPost'
import { urlName } from '~/util/urlName'
import { isEditorEmpty } from '@/util/isEditorEmpty'
import PlanetSelector from '@/components/PlanetSelector'

export default {
  components: {
    PlanetSelector,
    Editor: () => import('@/components/editor/Editor')
  },
  data() {
    return {
      prevRoute: null,
      textContent: null,
      title: '',
      titleRules: [
        (v) => v.length <= 300 || 'Title must be 300 characters or less'
      ],
      loading: false,
      dialog: false,
      planet: null
    }
  },
  computed: {
    urlName() {
      return urlName(this.title)
    },
    isEditorEmpty() {
      return isEditorEmpty(this.textContent)
    }
  },
  watch: {
    $route: {
      deep: true,
      handler() {
        if (!this.$route.query || !this.$route.query.editing) {
          this.dialog = false
        }
      }
    }
  },
  mounted() {
    if (this.$route.query && this.$route.query.editing) {
      const query = Object.assign({}, this.$route.query)
      delete query.editing
      this.$router.push({ path: this.$route.path, query })
    }
  },
  methods: {
    openDialog() {
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, editing: 'true' }
      })
      this.dialog = true
    },
    closeDialog() {
      if (!this.isEditorEmpty) {
        const confirmed = window.confirm(
          'Are you sure you want to discard this post?'
        )
        if (!confirmed) return
      }
      this.dialog = false
      const query = Object.assign({}, this.$route.query)
      delete query.editing
      this.$router.push({ path: this.$route.path, query })
      this.textContent = null
    },
    hideDialog() {
      this.dialog = false
      const query = Object.assign({}, this.$route.query)
      delete query.editing
      this.$router.push({ path: this.$route.path, query })
    },
    async submitPost() {
      this.loading = true

      try {
        await this.$apollo.mutate({
          mutation: submitPostGql,
          variables: {
            title: this.title,
            type: 'TEXT',
            textContent: this.textContent,
            planet: this.planet.name
          },
          update: (store, { data: { submitPost } }) => {
            this.$router.push(
              `/p/${this.planet.name}/comments/${submitPost.id}/${this.urlName}`
            )
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
    title: 'New Text Post'
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => (vm.prevRoute = from))
  }
}
</script>

<style scoped></style>
