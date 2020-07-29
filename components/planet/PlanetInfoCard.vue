<template>
  <v-card flat :outlined="!$vuetify.theme.dark">
    <v-img
      alt="Planet cover image"
      :src="planet.cardImageUrl"
      height="150"
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
          <nuxt-link :to="`/p/${planet.name}`">{{ planet.name }}</nuxt-link>
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

      <v-chip
        close
        :close-icon="planet.joined ? '' : $vuetify.icons.values.mdiPlus"
        color="primary"
        @click="toggleJoin"
        @click:close="toggleJoin"
        >{{ planet.joined ? 'Joined' : 'Join' }}</v-chip
      >
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
  </v-card>
</template>

<script>
import { format } from 'date-fns'
import joinPlanetGql from '@/gql/joinPlanet'
import joinedPlanetsGql from '@/gql/joinedPlanets'
import leavePlanetGql from '@/gql/leavePlanet'

export default {
  name: 'PlanetInfoCard',
  props: {
    planet: {
      type: Object,
      required: true
    }
  },
  computed: {
    createdDate() {
      return 'Created ' + format(new Date(this.planet.createdAt), 'MMM d, yyyy')
    }
  },
  methods: {
    toggleJoin() {
      if (this.planet.joined) this.leavePlanet()
      else this.joinPlanet()
    },
    joinPlanet() {
      if (!this.$store.state.currentUser) {
        this.$router.push('/signup')
        return
      }
      this.planet.joined = true
      this.planet.userCount++
      this.$apollo.mutate({
        mutation: joinPlanetGql,
        variables: {
          planetName: this.planetName
        },
        refetchQueries: [{ query: joinedPlanetsGql }]
      })
    },
    leavePlanet() {
      this.planet.joined = false
      this.planet.userCount--
      this.$apollo.mutate({
        mutation: leavePlanetGql,
        variables: {
          planetName: this.planetName
        },
        refetchQueries: [{ query: joinedPlanetsGql }]
      })
    }
  }
}
</script>

<style scoped></style>
