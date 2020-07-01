<template>
  <div v-html="content" />
</template>

<script>
import xss from 'xss'
import marked from 'marked'
import { escapeHtml } from '../util/escapeHtml'

export default {
  props: {
    textContent: {
      type: String,
      required: true
    }
  },
  computed: {
    content() {
      return xss(
        marked(
          escapeHtml(this.textContent)
            .replace(/(\/u\/\S+)/gi, `<a href="$1">$1</a>`)
            .replace(
              /\[([a-zA-Z0-9 ]*)*\]([^(]|$)/gi,
              `<a href="/topic/$1">[$1]</a>`
            )
        )
      )
    }
  },
  watch: {
    content: 'contentUpdated'
  },
  mounted() {
    this.$nextTick(this.addListeners)
  },
  beforeDestroy() {
    this.removeListeners()
  },
  methods: {
    navigate(event) {
      let target = event.target
      let i = 0
      // Go through 5 parents max to find a tag
      while (
        i < 5 &&
        !(target instanceof HTMLAnchorElement) &&
        target.parentNode
      ) {
        target = target.parentNode
        i++
      }
      // If target is still not a link, ignore
      if (!(target instanceof HTMLAnchorElement)) {
        return
      }
      let href = target.getAttribute('href')
      // Get link target, if local link, navigate with router link
      if (href && href[0] === '/') {
        if (href.includes(' ')) href = href.replace(/ /g, '_')
        event.preventDefault()
        this.$router.push(href)
      }
    },
    contentUpdated() {
      this.removeListeners()
      this.$nextTick(() => {
        this.addListeners()
      })
    },
    addListeners() {
      this._links = this.$el.getElementsByTagName('a')
      for (let i = 0; i < this._links.length; i++) {
        this._links[i].addEventListener('click', this.navigate, false)
      }
    },
    removeListeners() {
      for (let i = 0; i < this._links.length; i++) {
        this._links[i].removeEventListener('click', this.navigate, false)
      }
      this._links = []
    }
  }
}
</script>

<style scoped></style>
