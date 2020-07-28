<template>
  <v-combobox
    ref="combobox"
    v-model="planet"
    solo
    flat
    :items="search && searchPlanets.length > 0 ? searchPlanets : items"
    item-text="fullName"
    item-value="name"
    label="Choose a planet"
    class="namefield"
    @keydown="updateSearch"
  >
    <template v-slot:prepend-inner>
      <v-avatar
        v-if="planet"
        class="mr-2"
        size="24"
        :color="
          planet.avatarImageUrl && planet.themeColor ? planet.themeColor : ''
        "
      >
        <v-img v-if="planet.avatarImageUrl" :src="planet.avatarImageUrl" />
        <v-icon v-else>{{ $vuetify.icons.values.mdiEarth }}</v-icon>
      </v-avatar>

      <span v-else class="text--secondary">p/</span>
    </template>

    <template v-slot:selection="data">
      <span class="text--primary">{{ data.item.fullName }}</span>
      <span class="ml-2 text--secondary" style="font-size: 0.93rem"
        >p/{{ data.item.name }}</span
      >
    </template>

    <template v-slot:item="data">
      <v-list-item-avatar>
        <v-avatar
          v-if="data.item.avatarImageUrl"
          :color="data.item.themeColor ? data.item.themeColor : 'primary'"
          left
        >
          <v-img :src="data.item.avatarImageUrl" />
        </v-avatar>
        <v-icon v-else>{{ $vuetify.icons.values.mdiEarth }}</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title style="font-size: 1rem">{{
          data.item.fullName
        }}</v-list-item-title>
        <v-list-item-subtitle style="font-size: 0.93rem"
          >p/{{ data.item.name }}</v-list-item-subtitle
        >
      </v-list-item-content>
    </template>
  </v-combobox>
</template>

<script>
import gql from 'graphql-tag'
import joinedPlanetsGql from '../gql/joinedPlanets.graphql'
import searchPlanetsGql from '../gql/searchPlanets.graphql'

export default {
  name: 'PlanetSelector',
  props: {
    prevRoute: {
      type: Object,
      default: null
    },
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      joinedPlanets: [],
      searchPlanets: [],
      search: '',
      planet: this.value,
      prevPlanet: null
    }
  },
  computed: {
    items() {
      if (
        this.prevPlanet &&
        !this.joinedPlanets.find((p) => p.name === this.prevPlanet.name)
      ) {
        return [this.prevPlanet].concat(this.joinedPlanets)
      } else return this.joinedPlanets
    }
  },
  watch: {
    planet: {
      deep: true,
      handler() {
        this.$emit('input', this.planet)
      }
    },
    prevRoute: {
      deep: true,
      async handler() {
        if (
          this.prevRoute &&
          this.prevRoute.name &&
          this.prevRoute.name.startsWith('p-')
        ) {
          const planetName = this.prevRoute.params.name
          const { data } = await this.$apollo.query({
            query: gql`
              query($planetName: ID!) {
                planet(planetName: $planetName) {
                  name
                  fullName
                  avatarImageUrl
                }
              }
            `,
            variables: {
              planetName
            }
          })
          this.prevPlanet = data.planet
          this.planet = this.prevPlanet
        }
      }
    }
  },
  apollo: {
    joinedPlanets: {
      query: joinedPlanetsGql
    },
    searchPlanets: {
      query: searchPlanetsGql,
      variables() {
        return {
          search: this.search
        }
      },
      skip() {
        return !this.search
      },
      debounce: 300
    }
  },
  methods: {
    updateSearch() {
      this.search = this.$refs.combobox.lazySearch
    }
  }
}
</script>

<style scoped>
>>> .v-input__prepend-inner {
  padding-right: 0 !important;
}

.namefield >>> .v-label {
  top: initial !important;
}
</style>
