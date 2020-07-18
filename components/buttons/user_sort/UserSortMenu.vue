<template>
  <v-bottom-sheet v-if="!$device.isDesktop" v-model="menu">
    <template v-slot:activator="{ on }">
      <UserSortMenuButton v-on="on" />
    </template>
    <UserSortMenuContent :open="menu" @selected="menu = false" />
  </v-bottom-sheet>

  <v-menu
    v-else
    v-model="menu"
    bottom
    offset-y
    transition="slide-y-transition"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <UserSortMenuButton v-on="on" />
    </template>
    <UserSortMenuContent :open="menu" @selected="menu = false" />
  </v-menu>
</template>

<script>
import UserSortMenuContent from './UserSortMenuContent'
import UserSortMenuButton from './UserSortMenuButton'

export default {
  name: 'UserSortMenu',
  components: { UserSortMenuButton, UserSortMenuContent },
  data() {
    return {
      menu: false
    }
  }
}
</script>

<style scoped></style>
