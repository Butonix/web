<template>
  <v-card
    flat
    :outlined="!$vuetify.theme.dark && !isHover"
    :width="isHover ? 400 : undefined"
    :style="{
      'background-color': $vuetify.theme.dark ? '' : '#F1F3F4',
      'border-width': '1px',
      'border-bottom-right-radius': showViewPlanetBtn ? '0' : '10px',
      'border-bottom-left-radius': showViewPlanetBtn ? '0' : '10px'
    }"
    :tile="tile"
  >
    <v-img
      alt="Planet cover image"
      :src="planet.cardImageUrl"
      :height="planet.cardImageUrl ? 150 : 6"
      :style="
        `background-color: ${
          planet.themeColor ? planet.themeColor : 'var(--v-primary-base)'
        }`
      "
    />
    <v-list-item>
      <v-list-item-avatar>
        <nuxt-link
          style="height: 40px; min-width: 40px; width: 40px"
          :to="`/p/${planet.name}`"
        >
          <v-img v-if="planet.avatarImageUrl" :src="planet.avatarImageUrl" />
          <v-icon v-else>{{ $vuetify.icons.values.mdiEarth }}</v-icon>
        </nuxt-link>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title
          style="font-size: 1.43rem; font-weight: 500"
          class="mb-0"
        >
          <nuxt-link :to="`/p/${planet.name}`">{{ planet.name }}</nuxt-link>
        </v-list-item-title>
        <v-list-item-subtitle class="mt-1" style="font-size: 1rem">{{
          planet.description
        }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-actions>
      <v-chip outlined>
        <v-icon left>{{
          $vuetify.icons.values.mdiAccountMultipleOutline
        }}</v-icon>
        {{ planet.userCount }} User{{ planet.userCount === 1 ? '' : 's' }}
      </v-chip>

      <v-spacer />

      <v-chip
        close
        :close-icon="planet.joined ? '' : $vuetify.icons.values.mdiPlus"
        :color="planet.themeColor ? planet.themeColor : 'primary'"
        class="white--text"
        @click="toggleJoin"
        @click:close="toggleJoin"
        >{{ planet.joined ? 'Joined' : 'Join' }}</v-chip
      >
    </v-card-actions>

    <v-card-actions class="pt-0">
      <v-chip outlined small class="mr-2" nuxt :to="`/g/${planet.galaxy.name}`">
        <v-icon small class="mr-2">{{
          $vuetify.icons.values[planet.galaxy.icon]
        }}</v-icon>
        {{ planet.galaxy.fullName }}
      </v-chip>

      <v-spacer />

      <span class="text--secondary">{{ createdDate }}</span>
    </v-card-actions>

    <v-card-actions
      v-if="
        showEditBtn &&
          $store.state.currentUser &&
          $route.params.planetname &&
          $store.state.currentUser.moderatedPlanets
            .map((p) => p.name)
            .includes($route.params.planetname)
      "
      class="pb-3 pt-1"
    >
      <v-btn
        depressed
        class="flex-grow-1"
        :style="$vuetify.theme.dark ? '' : 'background-color: #DEE1E6'"
        @click="editDialog = true"
        >Edit Planet
        <v-icon class="ml-2">{{
          $vuetify.icons.values.mdiPencil
        }}</v-icon></v-btn
      >
    </v-card-actions>

    <div v-if="showViewPlanetBtn && $route.params.planetname !== planet.name">
      <v-list-item nuxt :to="`/p/${planet.name}`">
        <v-list-item-icon
          ><v-icon>{{
            $vuetify.icons.values.mdiOpenInNew
          }}</v-icon></v-list-item-icon
        >
        <v-list-item-content>
          <v-list-item-title>View planet</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>

    <v-dialog v-model="editDialog" width="35%" persistent>
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
                  v-model="themeColor"
                  :class="
                    $vuetify.theme.dark ? 'darkcolorpicker' : 'lightcolorpicker'
                  "
                  :swatches="swatches"
                  show-swatches
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
                <v-checkbox label="Text Posts" hide-details />
                <v-checkbox label="Link Posts" hide-details />
                <v-checkbox label="Image Uploads" hide-details />
                <v-checkbox label="Moderator Posts Only" hide-details />
              </div>
            </v-expand-transition>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="cancelEdits">Cancel</v-btn>
          <v-btn depressed color="primary" @click="confirmEdits">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { format } from 'date-fns'
import colors from 'vuetify/lib/util/colors'
import joinPlanetGql from '@/gql/joinPlanet'
import joinedPlanetsGql from '@/gql/joinedPlanets'
import leavePlanetGql from '@/gql/leavePlanet'

export default {
  name: 'PlanetInfoCard',
  props: {
    planet: {
      type: Object,
      required: true
    },
    isHover: {
      type: Boolean,
      default: false
    },
    showViewPlanetBtn: {
      type: Boolean,
      default: false
    },
    showEditBtn: {
      type: Boolean,
      default: false
    },
    tile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editDialog: false,
      themeColor: this.planet.themeColor ? this.planet.themeColor : '#EF5350',
      swatches: [[]],
      showColorPicker: false,
      showCustomName: false,
      showDescription: false,
      showInviteMods: false,
      showAllowedPosts: false
    }
  },
  computed: {
    createdDate() {
      return 'Created ' + format(new Date(this.planet.createdAt), 'MMM d, yyyy')
    }
  },
  watch: {
    themeColor() {
      this.$vuetify.theme.themes.dark.primary = this.themeColor
      this.$vuetify.theme.themes.light.primary = this.themeColor
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
      this.editDialog = false
    },
    confirmEdits() {
      this.editDialog = false
    },
    toggleJoin() {
      if (this.planet.joined) this.leavePlanet()
      else this.joinPlanet()
    },
    joinPlanet() {
      if (!this.$store.state.currentUser) {
        this.$router.push('/signup')
        return
      }
      this.planet.joined = true
      this.planet.userCount++
      this.$apollo.mutate({
        mutation: joinPlanetGql,
        variables: {
          planetName: this.planet.name
        },
        refetchQueries: [{ query: joinedPlanetsGql }]
      })
    },
    leavePlanet() {
      this.planet.joined = false
      this.planet.userCount--
      this.$apollo.mutate({
        mutation: leavePlanetGql,
        variables: {
          planetName: this.planet.name
        },
        refetchQueries: [{ query: joinedPlanetsGql }]
      })
    }
  }
}
</script>

<style scoped>
.darkcolorpicker >>> .v-color-picker__input > input {
  color: #ffffff !important;
}

.lightcolorpicker >>> .v-color-picker__input > input {
  color: #000000 !important;
}

.v-color-picker >>> .v-icon.theme--dark {
  color: #ffffff !important;
}
</style>
