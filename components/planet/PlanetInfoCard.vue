<template>
  <v-card
    flat
    :outlined="!$vuetify.theme.dark && !isHover"
    :width="isHover ? 400 : undefined"
    :style="{
      'border-width': '1px',
      'border-bottom-right-radius': showViewPlanetBtn ? '0' : '10px',
      'border-bottom-left-radius': showViewPlanetBtn ? '0' : '10px'
    }"
    :tile="tile"
  >
    <v-img
      alt="Planet cover image"
      :src="planet.cardImageUrl"
      :height="planet.cardImageUrl ? 150 : 6"
      :style="
        `background-color: ${
          planet.themeColor ? planet.themeColor : 'var(--v-primary-base)'
        }`
      "
    />
    <v-list-item>
      <v-list-item-avatar>
        <nuxt-link
          style="height: 40px; min-width: 40px; width: 40px"
          :to="`/p/${planet.name}`"
        >
          <v-img v-if="planet.avatarImageUrl" :src="planet.avatarImageUrl" />
          <v-icon v-else>{{ $vuetify.icons.values.mdiEarth }}</v-icon>
        </nuxt-link>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title
          style="font-size: 1.43rem; font-weight: 500"
          class="mb-0"
        >
          <nuxt-link :to="`/p/${planet.name}`">{{
            planet.customName ? planet.customName : planet.name
          }}</nuxt-link>
        </v-list-item-title>
        <v-list-item-subtitle class="mt-1" style="font-size: 1rem">{{
          planet.description
        }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-actions>
      <v-chip outlined>
        <v-icon left>{{
          $vuetify.icons.values.mdiAccountMultipleOutline
        }}</v-icon>
        {{ planet.userCount }} User{{ planet.userCount === 1 ? '' : 's' }}
      </v-chip>

      <v-spacer />

      <PlanetJoinButton :planet="planet" />
    </v-card-actions>

    <v-card-actions class="pt-0">
      <v-chip outlined small class="mr-2" nuxt :to="`/g/${planet.galaxy.name}`">
        <v-icon small class="mr-2">{{
          $vuetify.icons.values[planet.galaxy.icon]
        }}</v-icon>
        {{ planet.galaxy.fullName }}
      </v-chip>

      <v-spacer />

      <span class="text--secondary">{{ createdDate }}</span>
    </v-card-actions>

    <v-card-actions
      v-if="
        showEditBtn &&
          $store.state.currentUser &&
          $route.params.planetname &&
          $store.state.currentUser.moderatedPlanets
            .map((p) => p.name)
            .includes($route.params.planetname)
      "
      class="pb-3 pt-1"
    >
      <PlanetEditorDialog :planet="planet" />
    </v-card-actions>

    <div v-if="showViewPlanetBtn && $route.params.planetname !== planet.name">
      <v-list-item nuxt :to="`/p/${planet.name}`">
        <v-list-item-icon
          ><v-icon>{{
            $vuetify.icons.values.mdiOpenInNew
          }}</v-icon></v-list-item-icon
        >
        <v-list-item-content>
          <v-list-item-title>View planet</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
  </v-card>
</template>

<script>
import { format } from 'date-fns'
import PlanetEditorDialog from '@/components/planet/PlanetEditorDialog'
import PlanetJoinButton from '@/components/planet/PlanetJoinButton'

export default {
  name: 'PlanetInfoCard',
  components: { PlanetJoinButton, PlanetEditorDialog },
  props: {
    planet: {
      type: Object,
      required: true
    },
    isHover: {
      type: Boolean,
      default: false
    },
    showViewPlanetBtn: {
      type: Boolean,
      default: false
    },
    showEditBtn: {
      type: Boolean,
      default: false
    },
    tile: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    createdDate() {
      return 'Created ' + format(new Date(this.planet.createdAt), 'MMM d, yyyy')
    }
  }
}
</script>

<style scoped>
.darkcolorpicker >>> .v-color-picker__input > input {
  color: #ffffff !important;
}

.lightcolorpicker >>> .v-color-picker__input > input {
  color: #000000 !important;
}

.v-color-picker >>> .v-icon.theme--dark {
  color: #ffffff !important;
}
</style>
