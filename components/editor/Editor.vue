<template>
  <v-sheet
    :class="$vuetify.theme.dark ? 'editor-dark' : 'editor-light'"
    :style="$device.isDesktop ? 'position: relative; border-radius: 10px' : ''"
    @click.stop.prevent="editor.focus()"
  >
    <editor-content
      :class="{
        'editor-dark__content': $vuetify.theme.dark,
        'editor-light__content': !$vuetify.theme.dark,
        'pt-3': $device.isDesktop,
        'px-3': $device.isDesktop
      }"
      :editor="editor"
      style="min-height: 148px; padding-bottom: 64px"
    />

    <editor-menu-bar
      v-slot="{ commands, isActive }"
      :editor="editor"
      style="position: absolute; bottom: 0; left: 0; right: 0"
      :style="{
        'background-color': $vuetify.theme.dark ? '#35363A' : '#F1F3F4',
        'border-top-width': '1px',
        'border-top-color': $vuetify.theme.dark
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.12)',
        'border-top-style': 'solid',
        width: $device.isDesktop ? '' : '100%'
      }"
    >
      <v-row
        :class="$device.isDesktop ? 'px-3 py-1' : ''"
        class="menubar flex-grow-1 mx-0"
        :style="
          $device.isDesktop
            ? 'min-width: 100%; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px'
            : $device.isIos
            ? 'padding-bottom: 24px'
            : ''
        "
        align="center"
      >
        <button
          title="Bold"
          class="menubar__button"
          :class="{
            'is-active': isActive.bold()
          }"
          @click="commands.bold"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatBold }}</v-icon>
        </button>

        <button
          title="Italic"
          class="menubar__button"
          :class="{
            'is-active': isActive.italic()
          }"
          @click="commands.italic"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatItalic }}</v-icon>
        </button>

        <button
          title="Strikethrough"
          class="menubar__button"
          :class="{
            'is-active': isActive.strike()
          }"
          @click="commands.strike"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatStrikethrough }}</v-icon>
        </button>

        <button
          title="Underline"
          class="menubar__button"
          :class="{
            'is-active': isActive.underline()
          }"
          @click="commands.underline"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatUnderline }}</v-icon>
        </button>

        <button
          title="Code"
          class="menubar__button"
          :class="{
            'is-active': isActive.code()
          }"
          @click="commands.code"
        >
          <v-icon>{{ $vuetify.icons.values.mdiCodeTags }}</v-icon>
        </button>

        <button
          title="Heading"
          class="menubar__button"
          :class="{
            'is-active': isActive.heading({ level: 2 })
          }"
          @click="commands.heading({ level: 2 })"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatSize }}</v-icon>
        </button>

        <button
          title="Bulleted List"
          class="menubar__button"
          :class="{
            'is-active': isActive.bullet_list()
          }"
          @click="commands.bullet_list"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatListBulleted }}</v-icon>
        </button>

        <button
          title="Numbered List"
          class="menubar__button"
          :class="{
            'is-active': isActive.ordered_list()
          }"
          @click="commands.ordered_list"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatListNumbered }}</v-icon>
        </button>

        <button
          title="Quote"
          class="menubar__button"
          :class="{
            'is-active': isActive.blockquote()
          }"
          @click="commands.blockquote"
        >
          <v-icon>{{ $vuetify.icons.values.mdiFormatQuoteClose }}</v-icon>
        </button>

        <button
          title="Code Block"
          class="menubar__button"
          :class="{
            'is-active': isActive.code_block()
          }"
          @click="commands.code_block"
        >
          <v-icon>{{ $vuetify.icons.values.mdiCodeNotEqualVariant }}</v-icon>
        </button>

        <button
          title="Divider"
          class="menubar__button"
          :class="{
            'is-active': isActive.horizontal_rule()
          }"
          @click="commands.horizontal_rule"
        >
          <v-icon>{{ $vuetify.icons.values.mdiMinus }}</v-icon>
        </button>

        <button
          title="Link"
          class="menubar__button mr-auto"
          :class="{ 'is-active': isActive.link() }"
          @click="showLinkPrompt(commands.link)"
        >
          <v-icon>{{ $vuetify.icons.values.mdiLink }}</v-icon>
        </button>

        <template v-if="$device.isDesktop">
          <v-btn
            v-if="showCancelBtn"
            small
            text
            @click.stop.prevent="$emit('cancelled')"
            >Cancel</v-btn
          >
          <v-btn
            small
            depressed
            color="primary"
            class="ml-2"
            :loading="loading"
            @click.stop.prevent="$emit('submitted')"
            >Submit</v-btn
          >
        </template>
      </v-row>
    </editor-menu-bar>
  </v-sheet>
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
    showCancelBtn: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
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
        editable: true,
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
