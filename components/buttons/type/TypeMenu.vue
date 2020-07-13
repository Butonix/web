<template>
  <v-menu offset-y transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn small text rounded class="mr-1 font-weight-regular" v-on="on">
        <v-icon size="20" class="mr-2">{{
          $vuetify.icons.values.mdiFilterVariant
        }}</v-icon>
        {{ typeString }}
      </v-btn>
    </template>

    <TypeMenuContent />
  </v-menu>
</template>

<script>
import TypeMenuContent from './TypeMenuContent'
export default {
  name: 'TypeMenu',
  components: { TypeMenuContent },
  computed: {
    typeString() {
      if (!this.$route.query.types) return 'Everything'
      let arr = this.$route.query.types.split('-')
      arr = arr.map((s) => s[0].toUpperCase() + s.substring(1))
      return arr
        .join(' + ')
        .replace('Image', 'Images')
        .replace('Link', 'Links')
    }
  }
}
</script>

<style scoped></style>
