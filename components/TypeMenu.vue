<template>
  <v-bottom-sheet v-model="menu" inset :width="$device.isDesktop ? '20%' : ''">
    <template v-slot:activator="{ on }">
      <v-btn
        class="betterbutton"
        outlined
        rounded
        :style="
          $vuetify.theme.dark
            ? 'border-color: rgba(255, 255, 255, 0.12);'
            : 'border-color: rgba(0, 0, 0, 0.12);'
        "
        v-on="on"
      >
        <v-icon class="mr-2">{{
          $route.query.feed === 'mytopics' ? icons.myTopics : icons.all
        }}</v-icon>
        {{ $route.query.feed === 'mytopics' ? 'My Topics' : 'All' }}
      </v-btn>
    </template>

    <v-list class="py-0">
      <v-list-item @click="chooseAll">
        <v-list-item-icon>
          <v-icon>{{ icons.all }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            :class="!$route.query.feed ? 'font-weight-bold' : ''"
            >All</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="chooseMyTopics">
        <v-list-item-icon>
          <v-icon>{{ icons.myTopics }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            :class="$route.query.feed === 'mytopics' ? 'font-weight-bold' : ''"
            >My Topics</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-divider class="my-0" />

      <v-list-item :disabled="textDisabled" @click="toggle('text')">
        <v-list-item-action>
          <v-checkbox v-model="textEnabled" readonly />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title
            >Text<v-icon small class="ml-3">{{
              icons.text
            }}</v-icon></v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item :disabled="linksDisabled" @click="toggle('links')">
        <v-list-item-action>
          <v-checkbox v-model="linksEnabled" readonly />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title
            >Links<v-icon small class="ml-3">{{
              icons.links
            }}</v-icon></v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item :disabled="imagesDisabled" @click="toggle('images')">
        <v-list-item-action>
          <v-checkbox v-model="imagesEnabled" readonly />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title
            >Images<v-icon small class="ml-3">{{
              icons.images
            }}</v-icon></v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-bottom-sheet>
</template>

<script>
import {
  mdiNewspaper,
  mdiAllInclusive,
  mdiImage,
  mdiLink,
  mdiText
} from '@mdi/js'

export default {
  name: 'TypeMenu',
  data() {
    return {
      menu: false,
      icons: {
        all: mdiAllInclusive,
        myTopics: mdiNewspaper,
        images: mdiImage,
        links: mdiLink,
        text: mdiText
      }
    }
  },
  computed: {
    textEnabled() {
      return (
        !this.$route.query.types ||
        this.$route.query.types.split('-').includes('text')
      )
    },
    linksEnabled() {
      return (
        !this.$route.query.types ||
        this.$route.query.types.split('-').includes('links')
      )
    },
    imagesEnabled() {
      return (
        !this.$route.query.types ||
        this.$route.query.types.split('-').includes('images')
      )
    },
    textDisabled() {
      return (
        this.$route.query.types &&
        this.$route.query.types.split('-').length === 1 &&
        this.$route.query.types.split('-').includes('text')
      )
    },
    linksDisabled() {
      return (
        this.$route.query.types &&
        this.$route.query.types.split('-').length === 1 &&
        this.$route.query.types.split('-').includes('links')
      )
    },
    imagesDisabled() {
      return (
        this.$route.query.types &&
        this.$route.query.types.split('-').length === 1 &&
        this.$route.query.types.split('-').includes('images')
      )
    }
  },
  methods: {
    chooseAll() {
      this.menu = false
      const query = Object.assign({}, this.$route.query)
      delete query.feed
      this.$router.push({ path: this.$route.path, query })
    },
    chooseMyTopics() {
      this.menu = false

      if (!this.$apolloHelpers.getToken()) {
        this.$store.dispatch('displaySnackbar', 'Must login to view My Topics')
        return
      }

      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, feed: 'mytopics' }
      })
    },
    toggle(type) {
      let types = this.$route.query.types
        ? this.$route.query.types.split('-')
        : []

      if (types.length === 0) {
        types = ['text', 'links', 'images'].filter((t) => t !== type)
      } else if (types.includes(type)) types = types.filter((t) => t !== type)
      else types.push(type)

      const query = Object.assign({}, this.$route.query)

      if (types.length === 0 || types.length === 3) {
        delete query.types
      } else {
        query.types = types.join('-')
      }

      this.$router.push({
        path: this.$route.path,
        query
      })
    }
  }
}
</script>

<style scoped></style>
