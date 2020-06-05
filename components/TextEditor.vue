<template>
  <div>
    <v-row v-if="showButtons" class="ma-0 pb-1">
      <v-btn x-small icon depressed color="primary" class="mr-2" @click="bold">
        <v-icon>mdi-format-bold</v-icon>
      </v-btn>

      <v-btn
        x-small
        icon
        depressed
        color="primary"
        class="mr-2"
        @click="italic"
      >
        <v-icon>mdi-format-italic</v-icon>
      </v-btn>

      <v-btn
        x-small
        icon
        depressed
        color="primary"
        class="mr-2"
        @click="strikethrough"
      >
        <v-icon>mdi-format-strikethrough</v-icon>
      </v-btn>

      <v-btn
        x-small
        icon
        depressed
        color="primary"
        class="mr-2"
        @click="linkPrompt"
      >
        <v-icon>mdi-link</v-icon>
      </v-btn>

      <v-btn x-small icon depressed color="primary" class="mr-2" @click="quote">
        <v-icon>mdi-format-quote-close</v-icon>
      </v-btn>

      <v-btn x-small icon depressed color="primary" class="mr-2" @click="code">
        <v-icon>mdi-code-tags</v-icon>
      </v-btn>

      <v-btn
        x-small
        icon
        depressed
        color="primary"
        class="mr-2"
        @click="unorderedList"
      >
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-btn>

      <v-btn
        x-small
        icon
        depressed
        color="primary"
        class="mr-2"
        @click="orderedList"
      >
        <v-icon>mdi-format-list-numbered</v-icon>
      </v-btn>
    </v-row>

    <v-textarea
      ref="textarea"
      v-model="$attrs.value"
      filled
      :label="currentUser ? label : 'Must log in to comment'"
      :hide-details="!showDetails"
      :rows="rows"
      :disabled="!currentUser"
      @input="updateTextContent"
      @focus="showButtons = true"
    />
  </div>
</template>

<script>
import currentUserGql from '../gql/currentUser.graphql'

export default {
  name: 'TextEditor',
  props: {
    label: {
      type: String,
      default: 'Write your post'
    },
    rows: {
      type: Number,
      default: 4
    },
    showDetails: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    textContent: '',
    currentUser: null,
    showButtons: false
  }),
  apollo: {
    currentUser: {
      query: currentUserGql
    }
  },
  watch: {
    textContent() {
      this.$attrs.value = this.textContent
      this.$emit('input', this.$attrs.value)
    }
  },
  methods: {
    updateTextContent() {
      this.$emit('input', this.$attrs.value)
      this.textContent = this.$attrs.value
    },
    bold() {
      const textarea = this.$refs.textarea.$refs.input
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = this.textContent.substring(0, start) + '**'
      const after = '**' + this.textContent.substring(end)
      const middle = this.textContent.substring(start, end)
      this.textContent = before + middle + after
      this.$nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start + 2, end + 2)
      })
    },
    italic() {
      const textarea = this.$refs.textarea.$refs.input
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = this.textContent.substring(0, start) + '*'
      const after = '*' + this.textContent.substring(end)
      const middle = this.textContent.substring(start, end)
      this.textContent = before + middle + after
      this.$nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start + 1, end + 1)
      })
    },
    strikethrough() {
      const textarea = this.$refs.textarea.$refs.input
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = this.textContent.substring(0, start) + '~~'
      const after = '~~' + this.textContent.substring(end)
      const middle = this.textContent.substring(start, end)
      this.textContent = before + middle + after
      this.$nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start + 2, end + 2)
      })
    },
    linkPrompt() {
      const link = prompt('Enter the link')
      const textarea = this.$refs.textarea.$refs.input
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = this.textContent.substring(0, start) + '['
      const after = `](${link})` + this.textContent.substring(end)
      const middle = this.textContent.substring(start, end)
      this.textContent = before + middle + after
      this.$nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start + 1, end + 1)
      })
    },
    quote() {
      const textarea = this.$refs.textarea.$refs.input
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = this.textContent.substring(0, start) + '> '
      const after = this.textContent.substring(end)
      const middle = this.textContent.substring(start, end)
      this.textContent = before + middle + after
      this.$nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start + 2, end + 2)
      })
    },
    code() {
      const textarea = this.$refs.textarea.$refs.input
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const lineCounts = this.textContent.split('\n').map((s) => s.length + 1)
      const lines = []
      for (let i = lineCounts.length - 1; i >= 0; i--) {
        for (let j = 0; j <= i; j++) {
          lines[i] = (lines[i] || 0) + lineCounts[j]
        }
      }
      let startLine = -1
      let endLine = -1
      for (let i = 0; i < lines.length; i++) {
        const currentLineCount = lines[i]
        if (start < currentLineCount && startLine === -1) {
          startLine = i
        }
        if (end < currentLineCount && endLine === -1) {
          endLine = i
        }
      }
      const split = this.textContent.split('\n')
      for (let i = 0; i < split.length; i++) {
        if (i >= startLine && i <= endLine) {
          split[i] = '    ' + split[i]
        }
      }
      this.textContent = split.join('\n')
    },
    unorderedList() {
      const textarea = this.$refs.textarea.$refs.input
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const lineCounts = this.textContent.split('\n').map((s) => s.length + 1)
      const lines = []
      for (let i = lineCounts.length - 1; i >= 0; i--) {
        for (let j = 0; j <= i; j++) {
          lines[i] = (lines[i] || 0) + lineCounts[j]
        }
      }
      let startLine = -1
      let endLine = -1
      for (let i = 0; i < lines.length; i++) {
        const currentLineCount = lines[i]
        if (start < currentLineCount && startLine === -1) {
          startLine = i
        }
        if (end < currentLineCount && endLine === -1) {
          endLine = i
        }
      }
      const split = this.textContent.split('\n')
      for (let i = 0; i < split.length; i++) {
        if (i >= startLine && i <= endLine) {
          split[i] = '* ' + split[i]
        }
      }
      this.textContent = split.join('\n')
    },
    orderedList() {
      const textarea = this.$refs.textarea.$refs.input
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const lineCounts = this.textContent.split('\n').map((s) => s.length + 1)
      const lines = []
      for (let i = lineCounts.length - 1; i >= 0; i--) {
        for (let j = 0; j <= i; j++) {
          lines[i] = (lines[i] || 0) + lineCounts[j]
        }
      }
      let startLine = -1
      let endLine = -1
      for (let i = 0; i < lines.length; i++) {
        const currentLineCount = lines[i]
        if (start < currentLineCount && startLine === -1) {
          startLine = i
        }
        if (end < currentLineCount && endLine === -1) {
          endLine = i
        }
      }
      const split = this.textContent.split('\n')
      for (let i = 0; i < split.length; i++) {
        if (i >= startLine && i <= endLine) {
          split[i] = '1. ' + split[i]
        }
      }
      this.textContent = split.join('\n')
    }
  }
}
</script>

<style scoped></style>
