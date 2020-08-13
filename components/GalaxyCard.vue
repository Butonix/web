<template>
  <v-card flat :outlined="!$vuetify.theme.dark" style="border-width: 1px">
    <div
      :style="
        `height: 82px; background-image: url(${galaxy.bannerImageUrl ||
          ''}); background-size: cover; background-position: center; background-repeat: no-repeat; background-color: var(--v-primary-base)`
      "
      style="display: flex"
      :class="isAdmin ? 'editbanner' : ''"
      @click="openBannerInput"
    >
      <v-file-input
        v-if="isAdmin"
        ref="bannerinput"
        v-model="bannerFile"
        type="file"
        style="display: none"
      />
      <v-icon size="52" class="editbannericon" dark style="margin: auto auto">{{
        $vuetify.icons.values.mdiPencil
      }}</v-icon>
    </div>
    <v-row no-gutters class="pa-3" align="center" justify="space-between">
      <div class="text--secondary">
        <v-icon class="mr-2">{{ $vuetify.icons.values.mdiEarth }}</v-icon>
        {{ galaxy.planetCount }} Planet{{ galaxy.planetCount === 1 ? '' : 's' }}
      </div>
      <div style="text-align: center">
        <div style="font-size: 1.5rem; font-weight: 500">
          {{ galaxy.fullName }}
        </div>
        <div
          class="text--secondary"
          style="font-size: 1rem"
          :style="isAdmin ? 'cursor: pointer' : ''"
          @click="descriptionDialog = isAdmin"
        >
          {{ galaxy.description ? galaxy.description : 'Description' }}
        </div>
      </div>
      <div>
        <v-btn
          depressed
          color="primary"
          nuxt
          :to="`/planets/explore?galaxy=${galaxy.name}`"
        >
          <span style="color: #E8EAED">Explore</span>
        </v-btn>
      </div>
    </v-row>

    <v-dialog
      v-if="$store.state.currentUser && $store.state.currentUser.admin"
      v-model="descriptionDialog"
      width="35%"
      :fullscreen="!$device.isDesktop"
    >
      <v-card>
        <v-card-text>
          <v-textarea v-model="description" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn depressed color="primary" @click="editDescription">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'GalaxyCard',
  props: {
    galaxy: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      description: this.galaxy.description || '',
      bannerFile: null,
      descriptionDialog: false
    }
  },
  computed: {
    isAdmin() {
      return (
        this.$store.state.currentUser && this.$store.state.currentUser.admin
      )
    }
  },
  watch: {
    async bannerFile(val) {
      if (!val) return
      if (val.size > 4 * 1024 * 1024) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Too big - banner file must be less than 4MB'
        })
        this.bannerFile = null
        return
      }
      await this.$apollo.mutate({
        mutation: gql`
          mutation($galaxyName: ID!, $file: Upload!) {
            uploadGalaxyBannerImage(galaxyName: $galaxyName, file: $file)
          }
        `,
        variables: {
          galaxyName: this.galaxy.name,
          file: this.bannerFile
        }
      })
      this.refetchGalaxies()
    }
  },
  methods: {
    openBannerInput() {
      if (!this.isAdmin) return
      this.$refs.bannerinput.$refs.input.click()
    },
    async editDescription() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($galaxyName: ID!, $description: String!) {
            setGalaxyDescription(
              galaxyName: $galaxyName
              description: $description
            )
          }
        `,
        variables: {
          galaxyName: this.galaxy.name,
          description: this.description
        }
      })
      this.refetchGalaxies()
      this.descriptionDialog = false
    },
    refetchGalaxies() {
      this.$emit('refetch')
    }
  }
}
</script>

<style scoped>
.editplanetavatar:hover {
  opacity: 0.75;
  cursor: pointer;
}

.editplanetavatar:hover .editplaneticon {
  display: initial;
}

.editplaneticon {
  display: none;
}

.editbanner:hover {
  opacity: 0.75;
  cursor: pointer;
}

.editbanner:hover .editbannericon {
  display: initial;
}

.editbannericon {
  display: none;
}
</style>
