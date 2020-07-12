<template>
  <div :class="$vuetify.theme.dark ? 'editor-dark' : 'editor-light'">
    <editor-menu-bubble
      v-if="editable"
      v-slot="{ commands, isActive, getMarkAttrs, menu }"
      :editor="editor"
      :keep-in-bounds="true"
      @hide="hideLinkMenu"
    >
      <div
        class="menububble"
        :class="{
          'is-active': menu.isActive
        }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
        <form
          v-if="linkMenuIsActive"
          class="menububble__form"
          @submit.prevent="setLinkUrl(commands.link, linkUrl)"
        >
          <input
            ref="linkInput"
            v-model="linkUrl"
            class="menububble__input"
            type="text"
            placeholder="https://"
            @keydown.esc="hideLinkMenu"
          />
          <button
            class="menububble__button"
            type="button"
            @click="setLinkUrl(commands.link, null)"
          >
            <v-icon dark>{{ $vuetify.icons.values.mdiLinkOff }}</v-icon>
          </button>
        </form>

        <template v-else>
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
            <v-icon dark>{{
              $vuetify.icons.values.mdiFormatQuoteClose
            }}</v-icon>
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

          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.link() }"
            @click="showLinkMenu(getMarkAttrs('link'))"
          >
            <v-icon dark>{{ $vuetify.icons.values.mdiLink }}</v-icon>
          </button>
        </template>
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
      linkUrl: null,
      linkMenuIsActive: false,
      emitAfterOnUpdate: false,
      keepInBounds: true,
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
          new History()
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
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu() {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },
    setLinkUrl(command, url) {
      command({ href: url })
      this.hideLinkMenu()
    }
  }
}
</script>

<style lang="scss"></style>
