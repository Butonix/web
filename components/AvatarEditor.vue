<template>
  <div>
    <v-avatar size="150">
      <v-img
        max-height="150"
        max-width="150"
        :aspect-ratio="1"
        :src="previewUrl ? previewUrl : avataaarUrl"
        alt="Avatar"
      />
    </v-avatar>

    <v-row class="mt-2" no-gutters>
      <v-btn
        small
        text
        rounded
        :disabled="!!imageData"
        @click="randomizeAvataaar"
      >
        <v-icon class="mr-2" size="20">{{
          $vuetify.icons.values.mdiShuffleVariant
        }}</v-icon>
        Randomize
      </v-btn>

      <v-dialog
        v-model="avataaarDialog"
        persistent
        :transition="
          $device.isDesktop ? 'dialog-transition' : 'dialog-bottom-transition'
        "
        :fullscreen="!$device.isDesktop"
        max-width="35%"
      >
        <template v-slot:activator="{ on }">
          <v-btn small text rounded :disabled="!!imageData" v-on="on">
            <v-icon class="mr-2" size="20">{{
              $vuetify.icons.values.mdiFace
            }}</v-icon>
            Customize
          </v-btn>
        </template>

        <v-card :tile="!$device.isDesktop">
          <v-toolbar
            flat
            dense
            :color="$vuetify.theme.dark ? '#35363A' : '#F5F5F5'"
          >
            <v-spacer />
            <v-toolbar-items>
              <v-btn text color="primary" @click="avataaarDialog = false"
                >Done</v-btn
              >
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text class="pb-0 px-2">
            <v-row align="center" justify="center" no-gutters class="pb-4"
              ><v-img
                max-height="150"
                max-width="150"
                contain
                :src="avataaarUrl"
            /></v-row>

            <div
              style="max-height: 400px; overflow-y: auto; border-radius: 10px"
              :style="{
                'border-color': $vuetify.theme.dark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(0, 0, 0, 0.12)',
                'border-style': $device.isDesktop ? 'none' : 'solid'
              }"
              class="pa-3"
            >
              <NativeSelect
                v-model="topType"
                label="Top"
                outlined
                :items="topTypes"
              />

              <NativeSelect
                v-model="accessoriesType"
                label="Accessories"
                outlined
                :items="accessoriesTypes"
              />

              <NativeSelect
                v-model="hairColor"
                label="Hair Color"
                outlined
                :items="hairColors"
              />

              <NativeSelect
                v-model="facialHairType"
                label="Facial Hair"
                outlined
                :items="facialHairTypes"
              />

              <NativeSelect
                v-model="facialHairColor"
                label="Facial Hair Color"
                outlined
                :items="facialHairColors"
              />

              <NativeSelect
                v-model="clotheType"
                label="Clothes"
                outlined
                :items="clotheTypes"
              />

              <NativeSelect
                v-model="clotheColor"
                label="Clothes Color"
                outlined
                :items="clotheColors"
              />

              <NativeSelect
                v-model="eyeType"
                label="Eyes"
                outlined
                :items="eyeTypes"
              />

              <NativeSelect
                v-model="eyebrowType"
                label="Eyebrows"
                outlined
                :items="eyebrowTypes"
              />

              <NativeSelect
                v-model="mouthType"
                label="Mouth"
                outlined
                :items="mouthTypes"
              />

              <NativeSelect
                v-model="skinColor"
                label="Skin Color"
                outlined
                :items="skinColors"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>

    <v-file-input
      ref="fileInput"
      v-model="imageData"
      solo
      flat
      dense
      label="Use an image instead"
      class="mt-3 ml-2 fileupload"
      :prepend-icon="$vuetify.icons.values.mdiImage"
      :background-color="$vuetify.theme.dark ? '#202124' : 'grey lighten-2'"
      :style="$device.isDesktop ? 'max-width: 300px' : ''"
      :rules="uploadRules"
    />

    <v-row no-gutters>
      <v-btn
        rounded
        depressed
        color="primary"
        :loading="loading"
        :disabled="!imageValid || disabled"
        @click="changeProfilePic"
        >{{ buttonText }}</v-btn
      >

      <v-btn
        v-if="showCancel"
        rounded
        depressed
        text
        class="ml-1"
        @click="$emit('cancelled')"
        >Cancel</v-btn
      >
    </v-row>
  </div>
</template>

<script>
import {
  accessoriesTypes,
  clotheTypes,
  clotheColors,
  eyebrowTypes,
  eyeTypes,
  facialHairTypes,
  facialHairColors,
  hairColors,
  mouthTypes,
  randomFromArr,
  skinColors,
  topTypes
} from '../util/randomAvataaar'
import NativeSelect from '../components/NativeSelect'
import setProfilePicUrlGql from '../gql/setProfilePicUrl.graphql'

export default {
  name: 'AvatarEditor',
  components: { NativeSelect },
  props: {
    buttonText: {
      type: String,
      default: 'Continue'
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dialogOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageData: null,
      previewUrl: null,
      topTypes,
      accessoriesTypes,
      hairColors,
      facialHairTypes,
      facialHairColors,
      clotheTypes,
      clotheColors,
      eyeTypes,
      eyebrowTypes,
      mouthTypes,
      skinColors,
      topType: randomFromArr(topTypes),
      accessoriesType: randomFromArr(accessoriesTypes),
      hairColor: randomFromArr(hairColors),
      facialHairType: randomFromArr(facialHairTypes),
      facialHairColor: randomFromArr(facialHairColors),
      clotheType: randomFromArr(clotheTypes),
      clotheColor: randomFromArr(clotheColors),
      eyeType: randomFromArr(eyeTypes),
      eyebrowType: randomFromArr(eyebrowTypes),
      mouthType: randomFromArr(mouthTypes),
      skinColor: randomFromArr(skinColors),
      avataaarDialog: false,
      loading: false,
      uploadRules: [
        (v) => !!v || '',
        (v) => (v && v.size < 4 * 1024 * 1024) || 'Image must be 4MB or less',
        (v) =>
          (v && (v.type === 'image/jpeg' || v.type === 'image/png')) ||
          'Image must be PNG or JPEG'
      ]
    }
  },
  computed: {
    avataaarUrl() {
      return `https://api.getcomet.net/avataaar/?avatarStyle=Circle&topType=${this.topType}&accessoriesType=${this.accessoriesType}&hairColor=${this.hairColor}&facialHairType=${this.facialHairType}&facialHairColor=${this.facialHairColor}&clotheType=${this.clotheType}&clotheColor=${this.clotheColor}&eyeType=${this.eyeType}&eyebrowType=${this.eyebrowType}&mouthType=${this.mouthType}&skinColor=${this.skinColor}`
    },
    imageValid() {
      if (!this.imageData) return true
      return (
        this.imageData.size < 4 * 1024 * 1024 &&
        (this.imageData.type === 'image/jpeg' ||
          this.imageData.type === 'image/png')
      )
    }
  },
  watch: {
    imageData(imageData) {
      if (!imageData) {
        this.previewUrl = null
        this.$refs.fileInput.resetValidation()
      } else {
        this.previewUrl = null
        if (!this.imageValid) return
        const fr = new FileReader()
        fr.onload = () => {
          this.previewUrl = fr.result
        }
        fr.readAsDataURL(imageData)
      }
    },
    dialogOpen() {
      if (this.dialogOpen) this.init()
    },
    avataaarUrl() {
      if (this.avataaarUrl) this.previewUrl = null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.imageData = null
      const currentUser = this.$store.state.currentUser
      if (currentUser && currentUser.profilePicUrl) {
        const profilePicUrl = currentUser.profilePicUrl
        if (profilePicUrl.startsWith('https://api.getcomet.net/avataaar/')) {
          this.previewUrl = ''
          this.topType = profilePicUrl.split('&topType=')[1].split('&')[0]
          this.accessoriesType = profilePicUrl
            .split('&accessoriesType=')[1]
            .split('&')[0]
          this.hairColor = profilePicUrl.split('&hairColor=')[1].split('&')[0]
          this.facialHairType = profilePicUrl
            .split('&facialHairType=')[1]
            .split('&')[0]
          this.facialHairColor = profilePicUrl
            .split('&facialHairColor=')[1]
            .split('&')[0]
          this.clotheType = profilePicUrl.split('&clotheType=')[1].split('&')[0]
          this.clotheColor = profilePicUrl
            .split('&clotheColor=')[1]
            .split('&')[0]
          this.eyeType = profilePicUrl.split('&eyeType=')[1].split('&')[0]
          this.eyebrowType = profilePicUrl
            .split('&eyebrowType=')[1]
            .split('&')[0]
          this.mouthType = profilePicUrl.split('&mouthType=')[1].split('&')[0]
          this.skinColor = profilePicUrl.split('&skinColor=')[1].split('&')[0]
        } else {
          this.previewUrl = profilePicUrl
        }
      }
    },
    randomizeAvataaar() {
      this.topType = randomFromArr(topTypes)
      this.accessoriesType = randomFromArr(accessoriesTypes)
      this.hairColor = randomFromArr(hairColors)
      this.facialHairType = randomFromArr(facialHairTypes)
      this.facialHairColor = randomFromArr(facialHairColors)
      this.clotheType = randomFromArr(clotheTypes)
      this.clotheColor = randomFromArr(clotheColors)
      this.eyeType = randomFromArr(eyeTypes)
      this.eyebrowType = randomFromArr(eyebrowTypes)
      this.mouthType = randomFromArr(mouthTypes)
      this.skinColor = randomFromArr(skinColors)
      this.previewUrl = null
    },
    async changeProfilePic() {
      this.loading = true
      let link = this.avataaarUrl
      if (this.imageData) {
        try {
          link = await this.uploadPic()
        } catch (e) {
          this.$store.dispatch('displaySnackbar', { message: e.message })
          this.loading = false
          return
        }
      }

      await this.$apollo.mutate({
        mutation: setProfilePicUrlGql,
        variables: {
          profilePicUrl: link
        }
      })

      await this.$store.dispatch('fetchCurrentUser')
      this.loading = false
      this.$emit('finished')
    },
    async uploadPic() {
      const fd = new FormData()
      fd.append('image', this.imageData)

      const response = await this.$axios.$post('/uploadprofilepic', fd, {
        headers: {
          authorization: `Bearer ${this.$apolloHelpers.getToken()}`
        }
      })

      if (response.error || !response.link) {
        this.loading = false
        throw new Error('Upload failed')
      }

      return response.link
    }
  }
}
</script>

<style scoped></style>
