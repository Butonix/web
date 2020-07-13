<template>
  <v-container>
    <v-row justify="center">
      <v-col :cols="$device.isDesktop ? 9 : 12">
        <v-stepper
          v-model="step"
          vertical
          class="elevation-0"
          :style="
            $vuetify.theme.dark
              ? 'background-color: #313235'
              : 'background-color: #F5F5F5; border-style: solid'
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
            <AvatarEditor @finished="step = 3" />
          </v-stepper-content>

          <v-stepper-step step="3">Follow topics</v-stepper-step>
          <v-stepper-content step="3">
            <div>
              <FollowTopicChip
                v-for="topicName in [
                  'news',
                  'politics',
                  'gaming',
                  'science',
                  'programming',
                  'technology',
                  'conspiracy',
                  'videos',
                  'television',
                  'movies',
                  'sports',
                  'music',
                  'hip_hop_music',
                  'indie_music'
                ]"
                :key="topicName"
                :topic-name="topicName"
              />
            </div>

            <v-btn
              rounded
              depressed
              color="primary"
              class="mt-2"
              @click="$router.push(`/u/${$store.state.currentUser.username}`)"
              >Finish</v-btn
            >
          </v-stepper-content>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FollowTopicChip from '../../components/topic/FollowTopicChip'
import SignUpForm from '../../components/SignUpForm'
import AvatarEditor from '../../components/AvatarEditor'

export default {
  components: { AvatarEditor, SignUpForm, FollowTopicChip },
  data() {
    return {
      step: 1
    }
  }
}
</script>

<style scoped></style>
