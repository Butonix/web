<template>
  <div :class="$vuetify.theme.dark ? 'editor-dark' : 'editor-light'">
    <editor-content
      :class="
        $vuetify.theme.dark ? 'editor-dark__content' : 'editor-light__content'
      "
      :editor="editor"
      style="padding-bottom: 96px"
    />

    <editor-menu-bar
      v-if="editable"
      v-slot="{ commands, isActive }"
      :editor="editor"
      style="position: absolute; width: 100%; bottom: 0; left: 0; right: 0; padding-bottom: 8px; padding-left: 8px; padding-right: 8px"
      :style="{
        'background-color': $vuetify.theme.dark ? '#202124' : '#F5F5F5',
        'border-top-width': '1px',
        'border-top-color': 'rgba(0, 0, 0, 0.12)',
        'border-top-style': $vuetify.theme.dark ? 'none' : 'solid'
      }"
    >
      <div class="menubar pt-3">
        <button
          class="menubar__button"
          :class="{
            'is-active': isActive.bold()
          }"
          @click="commands.bold"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatBold }}</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{
            'is-active': isActive.italic()
          }"
          @click="commands.italic"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatItalic }}</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{
            'is-active': isActive.strike()
          }"
          @click="commands.strike"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatStrikethrough }}</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{
            'is-active': isActive.underline()
          }"
          @click="commands.underline"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatUnderline }}</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{
            'is-active': isActive.code()
          }"
          @click="commands.code"
        >
          <v-icon>{{ $vuetify.icons.values.mdiCodeTags }}</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{
            'is-active': isActive.heading({ level: 1 })
          }"
          @click="commands.heading({ level: 1 })"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatHeader1 }}</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{
            'is-active': isActive.heading({ level: 2 })
          }"
          @click="commands.heading({ level: 2 })"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatHeader2 }}</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{
            'is-active': isActive.heading({ level: 3 })
          }"
          @click="commands.heading({ level: 3 })"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatHeader3 }}</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{
            'is-active': isActive.bullet_list()
          }"
          @click="commands.bullet_list"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatListBulleted }}</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{
            'is-active': isActive.ordered_list()
          }"
          @click="commands.ordered_list"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatListNumbered }}</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{
            'is-active': isActive.blockquote()
          }"
          @click="commands.blockquote"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatQuoteClose }}</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{
            'is-active': isActive.code_block()
          }"
          @click="commands.code_block"
        >
          <v-icon>{{ $vuetify.icons.values.mdiCodeNotEqualVariant }}</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{
            'is-active': isActive.horizontal_rule()
          }"
          @click="commands.horizontal_rule"
        >
          <v-icon>{{ $vuetify.icons.values.mdiMinus }}</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.link() }"
          @click="showLinkPrompt(commands.link)"
        >
          <v-icon>{{ $vuetify.icons.values.mdiLink }}</v-icon>
        </button>
      </div>
    </editor-menu-bar>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  BulletList,
  CodeBlock,
  Heading,
  OrderedList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  HorizontalRule,
  ListItem,
  HardBreak,
  History,
  Placeholder
} from 'tiptap-extensions'

export default {
  name: 'Editor',
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: {
    value: {
      type: String,
      default: `<p></p>`
    },
    editable: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      emitAfterOnUpdate: false,
      editor: new Editor({
        onUpdate: ({ getHTML }) => {
          this.emitAfterOnUpdate = true
          this.$emit('input', getHTML())
        },
        editable: this.editable,
        content: this.value,
        autoFocus: this.autofocus,
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new Heading({ levels: [1, 2, 3] }),
          new OrderedList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new HorizontalRule(),
          new ListItem(),
          new HardBreak(),
          new History(),
          new Placeholder({
            showOnlyCurrent: false,
            emptyNodeText: 'Write something...'
          })
        ]
      })
    }
  },
  watch: {
    value(val) {
      if (this.emitAfterOnUpdate) {
        this.emitAfterOnUpdate = false
        return
      }
      this.editor.setContent(val)
    },
    editable() {
      this.editor.setOptions({
        editable: this.editable
      })
    },
    autofocus() {
      this.editor.setOptions({
        autoFocus: this.autofocus
      })
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    showLinkPrompt(command) {
      const linkUrl = prompt('Enter the URL of your link')
      if (linkUrl) {
        command({ href: linkUrl })
      }
    }
  }
}
</script>

<style lang="scss">
.editor-dark p.is-editor-empty:first-child::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
  font-style: italic;
}

.editor-light p.is-editor-empty:first-child::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
  font-style: italic;
}
</style>
