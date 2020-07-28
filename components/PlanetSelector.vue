<template>
  <v-combobox
    ref="combobox"
    v-model="planet"
    solo
    flat
    :items="allPlanets"
    item-text="name"
    item-value="name"
    label="Choose a planet"
    class="namefield"
  >
    <template v-slot:prepend-inner>
      <v-avatar
        class="mr-2"
        size="24"
        :color="
          planet && planet.avatarImageUrl && planet.themeColor
            ? planet.themeColor
            : ''
        "
      >
        <v-img
          v-if="planet && planet.avatarImageUrl"
          :src="planet.avatarImageUrl"
        />
        <v-icon v-else class="text--secondary">{{
          $vuetify.icons.values.mdiEarth
        }}</v-icon>
      </v-avatar>
    </template>

    <template v-slot:selection="data">
      <span class="text--primary">{{ data.item.name }}</span>
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
        <v-icon v-else class="text--secondary">{{
          $vuetify.icons.values.mdiEarth
        }}</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title style="font-size: 1rem">
          {{ data.item.name }}
        </v-list-item-title>
      </v-list-item-content>
    </template>
  </v-combobox>
</template>

<script>
import gql from 'graphql-tag'

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
      allPlanets: [],
      search: '',
      planet: this.value,
      prevPlanet: null
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
          const planetName = this.prevRoute.params.planetname
          const { data } = await this.$apollo.query({
            query: gql`
              query($planetName: ID!) {
                planet(planetName: $planetName) {
                  name
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
    allPlanets: {
      query: gql`
        query {
          allPlanets {
            avatarImageUrl
            name
          }
        }
      `
    }
  }
}
</script>

<style scoped>
>>> .v-input__prepend-inner {
  padding-right: 0 !important;
}

>>> .v-list-item {
  cursor: pointer;
}
</style>
