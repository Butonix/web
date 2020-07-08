<template>
  <div>
    <v-card
      outlined
      style="background-color: transparent; border-width: 1px; border-radius: 10px"
    >
      <editor-content :editor="editor" />
    </v-card>
    <v-row class="mx-0 mt-2">
      <v-spacer />
      <v-btn outlined>Post</v-btn>
    </v-row>
  </div>
</template>

<script>
import { Editor, EditorContent } from 'tiptap'

export default {
  name: 'HomePostEditor',
  components: {
    EditorContent
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.editor = new Editor({
      content: '<p>This is just a boring paragraph</p>'
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style scoped></style>
