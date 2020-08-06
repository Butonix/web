<template>
  <v-dialog v-model="dialog" width="35%" persistent>
    <template v-slot:activator="{ on }">
      <v-btn
        depressed
        class="flex-grow-1"
        :style="$vuetify.theme.dark ? '' : 'background-color: #DEE1E6'"
        v-on="on"
        >Edit Planet
        <v-icon class="ml-2">{{
          $vuetify.icons.values.mdiPencil
        }}</v-icon></v-btn
      >
    </template>

    <v-card>
      <v-card-title>p/{{ planet.name }}</v-card-title>
      <v-card-text>
        <div>
          <v-row
            v-ripple
            no-gutters
            style="cursor: pointer; border-radius: 10px; height: 48px"
            align="center"
            class="mb-3 px-3"
            @click="showColorPicker = !showColorPicker"
          >
            <div
              style="font-size: 1.143rem; font-weight: 500"
              class="text--primary"
            >
              Planet Color
            </div>
            <v-avatar size="24" color="primary" class="ml-3" />
            <v-spacer />
            <v-icon>{{
              showColorPicker
                ? $vuetify.icons.values.mdiChevronUp
                : $vuetify.icons.values.mdiChevronDown
            }}</v-icon>
          </v-row>
          <v-expand-transition>
            <div v-show="showColorPicker" class="px-3">
              <v-color-picker
                v-model="planetSettings.themeColor"
                :class="
                  $vuetify.theme.dark ? 'darkcolorpicker' : 'lightcolorpicker'
                "
                :swatches="swatches"
                show-swatches
              />

              <div
                style="font-size: 0.86rem; font-weight: 500"
                class="text--secondary"
              >
                Tip: Make sure your Planet's color looks good on both dark and
                light themes!
              </div>
            </div>
          </v-expand-transition>
        </div>

        <div>
          <v-row
            v-ripple
            no-gutters
            style="cursor: pointer; border-radius: 10px; height: 48px"
            align="center"
            class="mb-3 px-3"
            @click="showCustomName = !showCustomName"
          >
            <div
              style="font-size: 1.143rem; font-weight: 500"
              class="text--primary"
            >
              Custom Planet Name ({{
                planet.customName ? `"${planet.customName}"` : 'none'
              }})
            </div>
            <v-spacer />
            <v-icon>{{
              showCustomName
                ? $vuetify.icons.values.mdiChevronUp
                : $vuetify.icons.values.mdiChevronDown
            }}</v-icon>
          </v-row>
          <v-expand-transition>
            <div v-show="showCustomName" class="px-3">
              <v-text-field
                v-model="planetSettings.customName"
                solo
                flat
                class="darktextfield"
                label="Custom Planet Name"
              />
            </div>
          </v-expand-transition>
        </div>

        <div>
          <v-row
            v-ripple
            no-gutters
            style="cursor: pointer; border-radius: 10px; height: 48px"
            align="center"
            class="mb-3 px-3"
            @click="showDescription = !showDescription"
          >
            <div
              style="font-size: 1.143rem; font-weight: 500"
              class="text--primary"
            >
              Planet Description
            </div>
            <v-spacer />
            <v-icon>{{
              showDescription
                ? $vuetify.icons.values.mdiChevronUp
                : $vuetify.icons.values.mdiChevronDown
            }}</v-icon>
          </v-row>
          <v-expand-transition>
            <div v-show="showDescription" class="px-3">
              <v-textarea
                v-model="planetSettings.description"
                solo
                flat
                class="darktextfield"
                label="Planet Description"
              />
            </div>
          </v-expand-transition>
        </div>

        <div>
          <v-row
            v-ripple
            no-gutters
            style="cursor: pointer; border-radius: 10px; height: 48px"
            align="center"
            class="mb-3 px-3"
            @click="showInviteMods = !showInviteMods"
          >
            <div
              style="font-size: 1.143rem; font-weight: 500"
              class="text--primary"
            >
              Moderators
            </div>
            <v-spacer />
            <v-icon>{{
              showInviteMods
                ? $vuetify.icons.values.mdiChevronUp
                : $vuetify.icons.values.mdiChevronDown
            }}</v-icon>
          </v-row>
          <v-expand-transition>
            <div v-show="showInviteMods" class="px-3">
              <span
                ><v-chip
                  v-for="mod in planet.moderators"
                  :key="mod.username"
                  class="mr-2"
                  >{{ mod.username }}</v-chip
                ></span
              >

              <v-text-field
                v-model="inviteModUsername"
                :label="
                  `Invite a user to become a moderator of p/${planet.name}`
                "
                solo
                flat
                class="darktextfield mt-3"
                :append-icon="$vuetify.icons.values.mdiPlus"
              />
            </div>
          </v-expand-transition>
        </div>

        <div>
          <v-row
            v-ripple
            no-gutters
            style="cursor: pointer; border-radius: 10px; height: 48px"
            align="center"
            class="px-3"
            @click="showAllowedPosts = !showAllowedPosts"
          >
            <div
              style="font-size: 1.143rem; font-weight: 500"
              class="text--primary"
            >
              Allowed Post Types
            </div>
            <v-spacer />
            <v-icon>{{
              showAllowedPosts
                ? $vuetify.icons.values.mdiChevronUp
                : $vuetify.icons.values.mdiChevronDown
            }}</v-icon>
          </v-row>
          <v-expand-transition>
            <div v-show="showAllowedPosts" class="px-3">
              <v-checkbox
                v-model="planetSettings.allowTextPosts"
                label="Text Posts"
                hide-details
              />
              <v-checkbox
                v-model="planetSettings.allowLinkPosts"
                label="Link Posts"
                hide-details
              />
              <v-checkbox
                v-model="planetSettings.allowImagePosts"
                label="Image Uploads"
                hide-details
              />
              <v-checkbox
                v-model="planetSettings.modPostsOnly"
                label="Moderator Posts Only"
                hide-details
              />
            </div>
          </v-expand-transition>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="cancelEdits">Cancel</v-btn>
        <v-btn
          depressed
          color="primary"
          :loading="loading"
          @click="confirmEdits"
          >Done</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import colors from 'vuetify/lib/util/colors'
import gql from 'graphql-tag'
import planetGql from '@/gql/planet.graphql'

export default {
  name: 'PlanetEditorDialog',
  props: {
    planet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      swatches: [[]],
      showColorPicker: false,
      showCustomName: false,
      showDescription: false,
      showInviteMods: false,
      showAllowedPosts: false,
      inviteModUsername: '',
      planetSettings: {
        planetName: this.planet.name,
        ...this.planet
      }
    }
  },
  watch: {
    'planetSettings.themeColor'(val) {
      this.$vuetify.theme.themes.dark.primary = val
      this.$vuetify.theme.themes.light.primary = val
    }
  },
  mounted() {
    const keys = Object.keys(colors)
    const swatches = []
    keys.forEach((key) => {
      swatches.push(colors[key].lighten1)
    })
    const swatches2d = [[]]
    for (let i = 0; i < 5; i++) {
      swatches2d[i] = []
      for (let j = 0; j < swatches.length / 5; j++) {
        swatches2d[i][j] = swatches[j * (swatches.length / 5 + 1) + i]
      }
    }
    this.swatches = swatches2d
  },
  methods: {
    cancelEdits() {
      this.dialog = false
      this.planetSettings = { planetName: this.planet.name, ...this.planet }
    },
    async confirmEdits() {
      this.loading = true

      await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $planetName: ID!
            $allowTextPosts: Boolean!
            $allowLinkPosts: Boolean!
            $allowImagePosts: Boolean!
            $modPostsOnly: Boolean!
            $description: String!
            $customName: String
            $themeColor: String
          ) {
            setPlanetInfo(
              planetName: $planetName
              allowTextPosts: $allowTextPosts
              allowLinkPosts: $allowLinkPosts
              allowImagePosts: $allowImagePosts
              modPostsOnly: $modPostsOnly
              description: $description
              customName: $customName
              themeColor: $themeColor
            )
          }
        `,
        variables: {
          planetName: this.planet.name,
          ...this.planetSettings,
          themeColor: this.planetSettings.themeColor
        },
        refetchQueries: [
          { query: planetGql, variables: { planetName: this.planet.name } }
        ]
      })

      this.loading = false
      this.dialog = false
    }
  }
}
</script>

<style scoped></style>
