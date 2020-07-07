<template>
  <div class="pb-3">
    <v-card
      outlined
      style="background-color: transparent; border-width: 1px; border-radius: 10px"
    >
      <v-list-item three-line>
        <v-list-item-content style="align-content: start">
          <v-list-item-title>
            <nuxt-link
              class="text--primary"
              style="font-size: 1.125rem; font-weight: 500"
              :to="`/p/${source.id}`"
            >
              {{ source.title }}
            </nuxt-link>
          </v-list-item-title>
          <v-list-item-subtitle class="pt-1">
            <a v-if="source.link" class="hoverable">{{ source.link }}</a>
            <span v-else>
              {{ source.textContent }}
            </span>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-avatar
          v-if="source.thumbnailUrl"
          style="border-radius: 12px"
          size="72"
          tile
        >
          <img style="border-radius: 12px" :src="source.thumbnailUrl" />
        </v-list-item-avatar>
      </v-list-item>
      <v-card-actions class="pt-0 px-4">
        <UsernameMenu :source="source" />

        <!--<nuxt-link class="text&#45;&#45;primary" :to="`/u/${source.author.username}`">
          <v-avatar size="24" color="grey darken-3">
            <img
              src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          /></v-avatar>
          <span class="ml-1" style="font-size: .75rem">
            {{ source.author.username }}
          </span>
        </nuxt-link>-->
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { IdState } from 'vue-virtual-scroller'
import UsernameMenu from './UsernameMenu'

export default {
  name: 'ItemComponent',
  components: { UsernameMenu },
  mixins: [
    IdState({
      idProp: (vm) => vm.source.id
    })
  ],
  idState() {
    return {
      userCard: false
    }
  },
  props: {
    source: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped></style>
