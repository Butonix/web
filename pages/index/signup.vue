<template>
  <div style="display: flex; flex-direction: column">
    <v-text-field outlined label="Username" />
    <v-text-field outlined label="Email" />
    <v-text-field outlined label="Password" />
    <v-text-field outlined label="Confirm Password" />
    <v-row no-gutters>
      <v-spacer />
      <v-btn text rounded class="text--secondary mr-2" nuxt to="/">Back</v-btn>
      <v-btn depressed rounded color="primary">Sign Up</v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  transition: {
    name: 'scroll-x-transition',
    mode: 'out-in'
  }
}
</script>

<style scoped></style>
