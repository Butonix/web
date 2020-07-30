<template>
  <v-row justify="center">
    <v-col :cols="$device.isDesktop ? 9 : 12">
      <v-stepper
        v-model="step"
        vertical
        class="elevation-0"
        :style="
          $vuetify.theme.dark
            ? 'background-color: #35363A'
            : 'background-color: #F1F3F4; border-style: solid'
        "
        style="border-width: 1px; border-color: rgba(0, 0, 0, 0.12)"
      >
        <v-stepper-step :complete="step > 1" step="1">
          Create an account
        </v-stepper-step>

        <v-stepper-content step="1">
          <SignUpForm @submitted="step = 2" />
        </v-stepper-content>

        <v-stepper-step :complete="step > 2" step="2"
          >Choose your avatar</v-stepper-step
        >

        <v-stepper-content step="2">
          <AvatarEditor @finished="$router.push('/')" />
        </v-stepper-content>

        <!--<v-stepper-step step="3">Join planets</v-stepper-step>
        <v-stepper-content step="3">
          <div>
            Recent and recommended planets here
          </div>

          <v-btn rounded depressed color="primary" class="mt-2" nuxt to="/"
            >Finish</v-btn
          >
        </v-stepper-content>-->
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script>
import SignUpForm from '../../components/SignUpForm'
import AvatarEditor from '../../components/AvatarEditor'

export default {
  components: { AvatarEditor, SignUpForm },
  data() {
    return {
      step: 1
    }
  },
  head: {
    title: 'Sign Up'
  }
}
</script>

<style scoped></style>
