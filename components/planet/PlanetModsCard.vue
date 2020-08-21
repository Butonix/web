<template>
  <v-card class="mt-3" flat :outlined="!$vuetify.theme.dark">
    <v-list-item>
      <v-list-item-content class="pb-1">
        <v-list-item-title style="font-size: 1.143rem; font-weight: 500;"
          >Moderators</v-list-item-title
        >
        <div class="mt-2">
          <v-list-item
            v-for="mod in planet.moderators"
            :key="mod.id"
            class="px-0 pb-2"
            style="min-height: 0;"
          >
            <!--<v-list-item-avatar size="28" class="mr-2">
              <v-img :src="mod.profilePicUrl" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title style="font-size: 1.143rem">
                {{ mod.username }}
                <v-chip
                  v-if="mod.tag"
                  dark
                  small
                  :color="mod.tagColor"
                  class="ml-1"
                  style="border-radius: 12px !important;"
                >
                  {{ mod.tag }}
                </v-chip>
                <v-chip
                  v-if="mod.id === planet.creatorId"
                  dark
                  small
                  color="teal"
                  class="ml-1"
                  style="border-radius: 12px !important;"
                >
                  Creator
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>-->
            <UsernameMenu :user-data="mod" />
          </v-list-item>
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import UsernameMenu from '@/components/user/UsernameMenu'
export default {
  name: 'PlanetModsCard',
  components: { UsernameMenu },
  props: {
    planet: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
