<template>
  <div>
    <v-menu v-model="menu" offset-y close-on-content-click>
      <template v-slot:activator="{ on }">
        <v-btn text small v-on="on">
          <span class="mr-1">{{ type === 'all' ? 'Text + Links' : type }}</span>
          <v-icon v-if="type === 'all'" small>{{ icons.all }}</v-icon>
          <v-icon v-if="type === 'text'" small>{{ icons.text }}</v-icon>
          <v-icon v-if="type === 'link'" small>{{ icons.link }}</v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item @click="chooseAll">
          <v-list-item-icon class="mr-2">
            <v-icon>{{ icons.all }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Text + Links</v-list-item-title>
        </v-list-item>

        <v-list-item @click="chooseText">
          <v-list-item-icon class="mr-2">
            <v-icon>{{ icons.text }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Text Only</v-list-item-title>
        </v-list-item>

        <v-list-item @click="chooseLink">
          <v-list-item-icon class="mr-2">
            <v-icon>{{ icons.link }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Links Only</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mdiText, mdiLink, mdiAllInclusive } from '@mdi/js'

export default {
  name: 'TypeMenu',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      type: this.value,
      menu: false,
      icons: {
        all: mdiAllInclusive,
        text: mdiText,
        link: mdiLink
      }
    }
  },
  watch: {
    type() {
      this.$emit('input', this.type)
    }
  },
  methods: {
    chooseAll() {
      this.type = 'all'
    },
    chooseText() {
      this.type = 'text'
    },
    chooseLink() {
      this.type = 'link'
    }
  }
}
</script>

<style scoped></style>
