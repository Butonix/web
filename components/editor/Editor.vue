<template>
  <div :class="$vuetify.theme.dark ? 'editor-dark' : 'editor-light'">
    <editor-menu-bubble
      v-if="editable"
      v-slot="{ commands, isActive, menu }"
      :editor="editor"
      :keep-in-bounds="keepInBounds"
    >
      <div
        class="menububble"
        :class="{
          'is-active': menu.isActive
        }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
        <button
          class="menububble__button"
          :class="{
            'is-active': isActive.bold()
          }"
          @click="commands.bold"
        >
          <v-icon dark>{{ $vuetify.icons.values.mdiFormatBold }}</v-icon>
        </button>

        <button
          class="menububble__button"
          :class="{
            'is-active': isActive.italic()
          }"
          @click="commands.italic"
        >
          <v-icon dark>{{ $vuetify.icons.values.mdiFormatItalic }}</v-icon>
        </button>

        <button
          class="menububble__button"
          :class="{
            'is-active': isActive.strike()
          }"
          @click="commands.strike"
        >
          <v-icon dark>{{
            $vuetify.icons.values.mdiFormatStrikethrough
          }}</v-icon>
        </button>

        <button
          class="menububble__button"
          :class="{
            'is-active': isActive.underline()
          }"
          @click="commands.underline"
        >
          <v-icon dark>{{ $vuetify.icons.values.mdiFormatUnderline }}</v-icon>
        </button>

        <button
          class="menububble__button"
          :class="{
            'is-active': isActive.code()
          }"
          @click="commands.code"
        >
          <v-icon dark>{{ $vuetify.icons.values.mdiCodeTags }}</v-icon>
        </button>

        <button
          class="menububble__button"
          :class="{
            'is-active': isActive.heading({ level: 1 })
          }"
          @click="commands.heading({ level: 1 })"
        >
          <v-icon dark>{{ $vuetify.icons.values.mdiFormatHeader1 }}</v-icon>
        </button>

        <button
          class="menububble__button"
          :class="{
            'is-active': isActive.heading({ level: 2 })
          }"
          @click="commands.heading({ level: 2 })"
        >
          <v-icon dark>{{ $vuetify.icons.values.mdiFormatHeader2 }}</v-icon>
        </button>

        <button
          class="menububble__button"
          :class="{
            'is-active': isActive.heading({ level: 3 })
          }"
          @click="commands.heading({ level: 3 })"
        >
          <v-icon dark>{{ $vuetify.icons.values.mdiFormatHeader3 }}</v-icon>
        </button>

        <button
          class="menububble__button"
          :class="{
            'is-active': isActive.bullet_list()
          }"
          @click="commands.bullet_list"
        >
          <v-icon dark>{{
            $vuetify.icons.values.mdiFormatListBulleted
          }}</v-icon>
        </button>

        <button
          class="menububble__button"
          :class="{
            'is-active': isActive.ordered_list()
          }"
          @click="commands.ordered_list"
        >
          <v-icon dark>{{
            $vuetify.icons.values.mdiFormatListNumbered
          }}</v-icon>
        </button>

        <button
          class="menububble__button"
          :class="{
            'is-active': isActive.blockquote()
          }"
          @click="commands.blockquote"
        >
          <v-icon dark>{{ $vuetify.icons.values.mdiFormatQuoteClose }}</v-icon>
        </button>

        <button
          class="menububble__button"
          :class="{
            'is-active': isActive.code_block()
          }"
          @click="commands.code_block"
        >
          <v-icon dark>{{
            $vuetify.icons.values.mdiCodeNotEqualVariant
          }}</v-icon>
        </button>

        <button
          class="menububble__button"
          :class="{
            'is-active': isActive.horizontal_rule()
          }"
          @click="commands.horizontal_rule"
        >
          <v-icon dark>{{ $vuetify.icons.values.mdiMinus }}</v-icon>
        </button>
      </div>
    </editor-menu-bubble>

    <editor-content
      :class="
        $vuetify.theme.dark ? 'editor-dark__content' : 'editor-light__content'
      "
      :editor="editor"
    />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBubble } from 'tiptap'
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
  History
} from 'tiptap-extensions'

export default {
  name: 'Editor',
  components: {
    EditorContent,
    EditorMenuBubble
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      emitAfterOnUpdate: false,
      keepInBounds: true,
      editor: new Editor({
        onUpdate: ({ getJSON }) => {
          this.emitAfterOnUpdate = true
          this.$emit('input', getJSON())
        },
        editable: this.editable,
        content: this.value,
        autoFocus: true,
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
          new History()
        ]
      })
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (this.emitAfterOnUpdate) {
          this.emitAfterOnUpdate = false
          return
        }
        this.editor.setContent(val)
      }
    },
    editable() {
      this.editor.setOptions({
        editable: this.editable
      })
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style lang="scss"></style>
