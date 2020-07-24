<template>
  <v-row>
    <v-col>
      <v-text-field v-model="name" label="Name" />
      <v-text-field v-model="description" label="Description" />
      <v-btn
        depressed
        rounded
        color="primary"
        :disabled="!name || !description"
        @click="createPlanet"
        >Create</v-btn
      >
    </v-col>
  </v-row>
</template>

<script>
import createPlanetGql from '../../../gql/createPlanet.graphql'

export default {
  data() {
    return {
      name: '',
      description: ''
    }
  },
  methods: {
    async createPlanet() {
      await this.$apollo.mutate({
        mutation: createPlanetGql,
        variables: {
          name: this.name,
          description: this.description,
          galaxies: ['music']
        }
      })
      await this.$router.push(`/t/${this.name}`)
    }
  }
}
</script>

<style scoped></style>
