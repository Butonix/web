<template>
  <v-card
    class="px-4 pt-2"
    :flat="$vuetify.theme.dark"
    :outlined="!$vuetify.theme.dark"
    :style="$vuetify.theme.dark ? '' : 'border-width: 1px'"
  >
    <div class="overline text--secondary">NEW COMMENT</div>

    <Editor v-model="commentJSON" editable />

    <v-card-actions class="pl-0 pt-0">
      <span class="caption text--secondary"
        >Tip: Highlight text to use formatting</span
      >
      <v-spacer />

      <v-btn text color="primary" @click="$emit('cancelled')">Cancel</v-btn>

      <v-btn
        :disabled="isEditorEmpty"
        text
        color="primary"
        :loading="loading"
        @click="$emit('submitted')"
        >Post Comment</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { isEditorEmpty } from '../../util/isEditorEmpty'
import Editor from './Editor'

export default {
  name: 'CommentEditor',
  components: { Editor },
  props: {
    value: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      commentJSON: this.value
    }
  },
  computed: {
    isEditorEmpty() {
      return isEditorEmpty(this.commentJSON)
    }
  },
  watch: {
    commentJSON: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="scss"></style>
