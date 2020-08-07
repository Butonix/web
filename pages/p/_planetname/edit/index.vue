<template>
  <v-container>
    <v-row>
      <v-col :cols="$device.isDesktop ? 6 : 12">
        <div class="text-h4 pb-3">Edit p/{{ $route.params.planetname }}</div>
        <div class="pb-6">
          <div
            style="font-size: 1.143rem; font-weight: 500"
            class="text--primary"
          >
            Planet Color
          </div>
          <div
            style="font-size: 0.86rem; font-weight: 500"
            class="text--secondary pb-3"
          >
            Tip: Make sure your Planet's color looks good on both dark and light
            themes!
          </div>
          <div>
            <v-color-picker
              v-model="themeColor"
              :class="
                $vuetify.theme.dark ? 'darkcolorpicker' : 'lightcolorpicker'
              "
              :swatches="swatches"
              show-swatches
            />
          </div>
        </div>

        <div>
          <div
            style="font-size: 1.143rem; font-weight: 500"
            class="text--primary pb-3"
          >
            Custom Planet Name ({{
              planet.customName ? `"${planet.customName}"` : 'none'
            }})
          </div>
          <div>
            <v-text-field
              v-model="planet.customName"
              solo
              flat
              :counter="50"
              label="Custom Planet Name"
            />
          </div>
        </div>

        <div>
          <div
            style="font-size: 1.143rem; font-weight: 500"
            class="text--primary pb-3"
          >
            Planet Description
          </div>
          <div>
            <v-textarea
              v-model="planet.description"
              solo
              flat
              label="Planet Description (Required)"
            />
          </div>
        </div>

        <v-row no-gutters>
          <v-spacer />
          <v-btn
            depressed
            color="primary"
            :loading="loading"
            :disabled="
              !planet.description ||
                (planet.customName && planet.customName.length > 50)
            "
            @click="confirmEdits"
            >Done</v-btn
          >
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import colors from 'vuetify/lib/util/colors'
import gql from 'graphql-tag'
import planetGql from '@/gql/planet'

export default {
  middleware({ store, redirect, params }) {
    // If the user is not a mod of this planet
    if (
      !store.state.currentUser ||
      (!store.state.currentUser.moderatedPlanets.find(
        (p) => p.name.toLowerCase() === params.planetname.toLowerCase()
      ) &&
        !store.state.currentUser.admin)
    ) {
      return redirect(`/p/${params.planetname}`)
    }
  },
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const { data } = await client.query({
      query: planetGql,
      variables: { planetName: context.params.planetname }
    })
    return {
      planet: data.planet,
      themeColor: data.planet.themeColor
    }
  },
  data() {
    return {
      planet: null,
      loading: false,
      swatches: [[]],
      themeColor: '#EF5350'
    }
  },
  watch: {
    themeColor(val) {
      this.planet.themeColor = val.hex ? val.hex : val
    },
    'planet.themeColor'(val) {
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
        if (swatches[j * (swatches.length / 5 + 1) + i]) {
          swatches2d[i][j] = swatches[j * (swatches.length / 5 + 1) + i]
        }
      }
    }
    this.swatches = swatches2d
  },
  methods: {
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
          ...this.planet
        }
      })

      this.loading = false
      this.$router.push(`/p/${this.planet.name}`)
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
