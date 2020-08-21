<template>
  <div>
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
            style="display: flex;"
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
              @click.stop.prevent="closeAndGoBack"
            >
              <v-icon class="mr-2">{{
                $vuetify.icons.values.mdiCloseCircleOutline
              }}</v-icon>
              Close
            </v-btn>
            <v-btn
              text
              tile
              class="flex-grow-1"
              height="50"
              :disabled="isTextContentEmpty"
              :loading="loading"
              @click.stop.prevent="submit"
            >
              <v-icon class="mr-2">{{
                $vuetify.icons.values.mdiCheckCircleOutline
              }}</v-icon>
              Done
            </v-btn>
          </div>

          <div
            v-if="parentTextContent"
            style="
              font-size: 1rem;
              max-height: 200px;
              border-bottom-width: 1px;
              border-bottom-style: solid;
            "
            class="pa-2"
            :style="{
              'border-bottom-color': $vuetify.theme.dark
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.12)'
            }"
            v-html="parentTextContent"
          />

          <div style="font-size: 1rem;">
            <Editor
              v-model="textContent"
              editable
              autofocus
              :style="
                $device.isDesktop ? 'min-height: 296px; max-height: 600px' : ''
              "
              style="overflow-y: auto;"
              class="pa-2"
            />
          </div>
        </v-card>
      </v-dialog>
    </client-only>
  </div>
</template>

<script>
import { isEditorEmpty } from '@/util/isEditorEmpty'

export default {
  name: 'EditorDialog',
  components: { Editor: () => import('@/components/editor/Editor') },
  props: {
    parentTextContent: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      textContent: this.value
    }
  },
  computed: {
    isTextContentEmpty() {
      return isEditorEmpty(this.textContent)
    }
  },
  watch: {
    textContent() {
      this.$emit('input', this.textContent)
    },
    value() {
      this.textContent = this.value
    }
  },
  methods: {
    close() {
      this.dialog = false
      this.$emit('closed')
    },
    closeAndGoBack() {
      this.close()
      window.history.back()
    },
    submit() {
      this.$emit('submitted')
    },
    open() {
      if (!this.$store.state.currentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to reply'
        })
        return
      }
      this.dialog = true
      window.history.pushState(window.history.state, null, '?replying=true')
    }
  }
}
</script>

<style scoped></style>
