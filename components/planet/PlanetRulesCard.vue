<template>
  <v-card class="mt-3" flat :outlined="!$vuetify.theme.dark">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title
          style="font-size: 1.143rem; font-weight: 500"
          class="mb-0"
          >p/{{ planet.name }} Rules</v-list-item-title
        >
        <v-list-item-subtitle class="mt-2" style="font-size: 1rem">
          <ol>
            <li>Don't be a dick</li>
          </ol>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: 'PlanetRulesCard',
  props: {
    planet: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
