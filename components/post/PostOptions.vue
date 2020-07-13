<template>
  <v-bottom-sheet v-if="!$device.isDesktop" v-model="idState.menuOpen">
    <template v-slot:activator="{ on }">
      <PostOptionsBtn v-on="on" />
    </template>

    <PostOptionsContent
      :post="post"
      :hidden="hidden"
      :reported="reported"
      @hidden="$emit('hidden')"
      @unhidden="$emit('unhidden')"
      @reported="$emit('reported')"
      @selected="idState.menuOpen = false"
    />
  </v-bottom-sheet>

  <v-menu
    v-else
    v-model="idState.menuOpen"
    transition="slide-y-transition"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <PostOptionsBtn v-on="on" />
    </template>

    <PostOptionsContent
      :post="post"
      :hidden="hidden"
      :reported="reported"
      @hidden="$emit('hidden')"
      @unhidden="$emit('unhidden')"
      @reported="$emit('reported')"
      @selected="idState.menuOpen = false"
    />
  </v-menu>
</template>

<script>
import { IdState } from 'vue-virtual-scroller'
import PostOptionsBtn from './PostOptionsBtn'
import PostOptionsContent from './PostOptionsContent'
export default {
  name: 'PostOptions',
  components: { PostOptionsContent, PostOptionsBtn },
  mixins: [
    IdState({
      idProp: (vm) => vm.post.id
    })
  ],
  props: {
    post: {
      type: Object,
      required: true
    },
    hidden: {
      type: Boolean,
      default: false
    },
    reported: {
      type: Boolean,
      default: false
    }
  },
  idState() {
    return {
      menuOpen: false
    }
  }
}
</script>

<style scoped></style>
