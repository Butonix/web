<template>
  <div class="pb-3">
    <v-card
      outlined
      style="background-color: transparent; border-width: 1px; border-radius: 10px"
    >
      <v-list-item>
        <v-list-item-avatar
          v-if="source.type !== 'TEXT'"
          style="border-radius: 12px"
          class="my-3"
          size="64"
          :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-2'"
        >
          <img
            v-if="source.thumbnailUrl"
            style="border-radius: 12px"
            :src="source.thumbnailUrl"
          />
          <v-icon v-else size="32">{{ $vuetify.icons.values.mdiWeb }}</v-icon>
        </v-list-item-avatar>

        <v-list-item-content style="align-content: start">
          <span v-if="source.sticky">
            <v-icon color="primary" size="13" class="mr-1">{{
              $vuetify.icons.values.mdiStar
            }}</v-icon>
            <span class="overline primary--text mb-0">ANNOUNCEMENT</span>
          </span>

          <v-list-item-title style="white-space: normal">
            <nuxt-link
              class="text--primary mr-1"
              style="font-size: 1.125rem; font-weight: 500"
              :to="`/p/${source.id}`"
            >
              {{ source.title }}
            </nuxt-link>
            <TopicChip
              v-for="topic in source.topics"
              :key="topic.name"
              :topic-data="topic"
            />
          </v-list-item-title>
          <v-list-item-subtitle
            v-if="source.textContent || source.link"
            style="white-space: normal"
            class="pt-1"
          >
            <span v-if="source.type === 'LINK' || source.type === 'IMAGE'">
              <a
                class="hoverable"
                :href="source.link"
                rel="noopener"
                target="_blank"
                >{{ source.link }}</a
              >

              <v-dialog v-if="isEmbed" v-model="idState.dialog" max-width="50%">
                <template v-slot:activator="{ on }">
                  <v-btn icon small class="text--secondary mr-2" v-on="on">
                    <v-icon>{{
                      source.type === 'IMAGE'
                        ? $vuetify.icons.values.mdiImage
                        : $vuetify.icons.values.mdiLinkBox
                    }}</v-icon>
                  </v-btn>
                </template>

                <v-card>
                  <v-toolbar flat color="transparent">
                    <v-toolbar-title>{{ source.title }}</v-toolbar-title>
                  </v-toolbar>
                  <v-divider class="ma-0" />
                  <div
                    style="display: flex; justify-content: center"
                    class="pa-4"
                  >
                    <youtube
                      v-if="isYoutubeLink"
                      :video-id="$youtube.getIdFromUrl(source.link)"
                    />
                    <Tweet
                      v-else-if="isTwitterLink"
                      :id="source.link.split('status/')[1].split('?')[0]"
                      :options="{
                        theme: $vuetify.theme.dark ? 'dark' : 'light'
                      }"
                    />
                    <div
                      v-else-if="isEmbeddableImage"
                      ref="wrapper"
                      style="max-width: none"
                    >
                      <a
                        ref="link"
                        :href="source.link"
                        rel="noopener"
                        target="_blank"
                      >
                        <img
                          ref="img"
                          :src="source.link"
                          style="max-width: 500px"
                        />
                      </a>
                    </div>
                  </div>
                </v-card>
              </v-dialog>
            </span>

            <div v-else-if="source.type === 'TEXT' && source.textContent">
              <div
                ref="textcontent"
                :class="
                  !idState.viewingMore && idState.textContentHeight >= 100
                    ? 'textcontent'
                    : ''
                "
              >
                <TextContent :text-content="source.textContent" />
              </div>

              <a
                v-if="idState.textContentHeight >= 150"
                @click="idState.viewingMore = !idState.viewingMore"
                >View {{ idState.viewingMore ? 'less' : 'more' }}</a
              >
            </div>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions class="pt-0 pl-4 pr-2">
        <UsernameMenu :user="source.author" />

        <v-spacer />

        <v-chip outlined class="mr-4">
          <v-icon left>{{ $vuetify.icons.values.mdiCommentOutline }}</v-icon>
          {{ source.commentCount }}
        </v-chip>

        <v-chip outlined class="mr-4">
          <v-icon left>{{ $vuetify.icons.values.mdiRocket }}</v-icon>
          {{ source.endorsementCount }}
        </v-chip>

        <v-btn icon class="text--secondary">
          <v-icon>{{ $vuetify.icons.values.mdiDotsVertical }}</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { IdState } from 'vue-virtual-scroller'
import { Tweet } from 'vue-tweet-embed'
import UsernameMenu from './UsernameMenu'
import TextContent from './TextContent'
import TopicChip from './TopicChip'

export default {
  name: 'ItemComponent',
  components: { TopicChip, TextContent, UsernameMenu, Tweet },
  mixins: [
    IdState({
      idProp: (vm) => vm.source.id
    })
  ],
  props: {
    source: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isYoutubeLink() {
      return (
        this.source.type === 'LINK' &&
        (this.source.link.includes('youtube.com/') ||
          this.source.link.includes('youtu.be/'))
      )
    },
    isTwitterLink() {
      return (
        this.source.type === 'LINK' &&
        this.source.link.includes('twitter.com/') &&
        this.source.link.includes('/status/')
      )
    },
    isEmbeddableImage() {
      return (
        this.source.type === 'IMAGE' && this.source.link.startsWith('https://')
      )
    },
    isEmbed() {
      return this.isYoutubeLink || this.isTwitterLink || this.isEmbeddableImage
    }
  },
  watch: {
    'idState.dialog'(dialog) {
      if (!dialog || !this.isEmbeddableImage) return
      this.$nextTick(() => {
        const $img = this.$refs.img
        const $link = this.$refs.link
        const $wrapper = this.$refs.wrapper

        if ($img && $link && $wrapper) this.addImgDrag($img, $link, $wrapper)
      })
    }
  },
  mounted() {
    if (this.$refs.textcontent) {
      this.idState.textContentHeight = this.$refs.textcontent.clientHeight
    }
  },
  idState() {
    return {
      userCard: false,
      viewingMore: false,
      textContentHeight: 0,
      dialog: false
    }
  },
  methods: {
    addImgDrag($img, $link, $wrapper) {
      if (!$img || !$link || !$wrapper) return

      const threshold = 3

      $link.onclick = function(event) {
        event.preventDefault()
      }
      $link.onmousedown = function(event) {
        event.preventDefault() // prevents FF from overlaying the image with blue

        $link.dragging = true
        $link.startX = event.pageX
        $link.startY = event.pageY

        $img.originalWidth = $img.width

        $img.style.cssText = 'width: ' + $img.width + 'px;'
      }
      $link.onmousemove = function(event) {
        if (!$link.dragging) return
        const width =
          $img.originalWidth +
          event.pageX -
          $link.startX +
          event.pageY -
          $link.startY
        $img.style.cssText = 'cursor: nwse-resize; width: ' + width + 'px;'
      }
      $link.onmouseup = function(event) {
        // detect click not drag, goto link
        if (
          Math.abs(event.pageX - $link.startX + event.pageY - $link.startY) <=
            threshold &&
          event.button === 0
        ) {
          window.open($link.href, '_blank')
        }
        $link.dragging = false
        $img.style.cssText = $img.style.cssText.replace(
          'nwse-resize',
          'pointer'
        )
      }
      // prevent: leave container, mouse up, re-enter, still resizing
      $link.onmouseenter = function(event) {
        $link.dragging = false
      }
    }
  }
}
</script>

<style scoped>
.textcontent {
  max-height: 100px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(180deg, #000 60%, transparent);
  mask-image: linear-gradient(180deg, #000 60%, transparent);
}
</style>
