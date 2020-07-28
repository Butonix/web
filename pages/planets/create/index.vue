<template>
  <v-row justify="center">
    <v-col :cols="$device.isDesktop ? 6 : 12">
      <div class="text-h6">Create a Planet</div>
      <div class="text-subtitle-1 text--secondary mb-3">
        The Universe is in your hands!
      </div>
      <v-text-field
        v-model="name"
        class="namefield mb-3"
        autofocus
        solo
        flat
        label="Name"
        persistent-hint
        hint="Name shown in address bar (e.g p/Comet). Letters, numbers, and underscores. This cannot be changed later."
        :counter="21"
      >
        <template v-slot:prepend-inner>
          <span class="text--secondary">p/</span>
        </template>
      </v-text-field>

      <v-textarea
        v-model="description"
        class="descriptionfield mb-3"
        solo
        no-resize
        flat
        label="Description"
        persistent-hint
        hint='Explain what your Planet is all about (e.g. "Discussion of the Comet platform")'
      />

      <v-select
        ref="galaxyMenu"
        v-model="selectedGalaxy"
        :items="galaxies"
        solo
        flat
        label="Choose Galaxy"
        persistent-hint
        hint="Choose your planet's Galaxy"
        class="mb-3"
        item-text="fullName"
        item-value="name"
      >
        <template v-slot:selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            label
            @click="data.select"
          >
            <v-icon class="mr-2">{{
              $vuetify.icons.values[data.item.icon]
            }}</v-icon>
            {{ data.item.fullName }}
          </v-chip>
        </template>

        <template v-slot:item="data">
          <v-list-item-icon>
            <v-icon>{{ $vuetify.icons.values[data.item.icon] }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ data.item.fullName }}</v-list-item-title>
          </v-list-item-content>
        </template>
      </v-select>

      <v-btn
        depressed
        rounded
        color="primary"
        :disabled="!name || !description || !selectedGalaxy"
        :loading="createBtnLoading"
        @click="createPlanet"
        >Create</v-btn
      >
      <div class="text--secondary mt-2" style="font-size: .86rem">
        Further customization will be available on your Planet's page.
      </div>
    </v-col>
  </v-row>
</template>

<script>
import gql from 'graphql-tag'
import createPlanetGql from '../../../gql/createPlanet.graphql'

export default {
  data() {
    return {
      name: '',
      description: '',
      galaxies: [],
      selectedGalaxy: null,
      createBtnLoading: false
    }
  },
  apollo: {
    galaxies: {
      query: gql`
        query {
          galaxies {
            name
            fullName
            icon
          }
        }
      `
    }
  },
  methods: {
    async createPlanet() {
      this.createBtnLoading = true
      await this.$apollo.mutate({
        mutation: createPlanetGql,
        variables: {
          name: this.name,
          description: this.description,
          galaxy: this.selectedGalaxy
        }
      })
      this.createBtnLoading = false
      await this.$router.push(`/p/${this.name}`)
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

.descriptionfield >>> .v-label {
  top: 0.86rem !important;
}
</style>
