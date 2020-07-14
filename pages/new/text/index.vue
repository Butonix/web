<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-text-field
        :background-color="$vuetify.theme.dark ? '' : '#F5F5F5'"
        label="Title"
        solo
        flat
      />
      <client-only>
        <v-card
          class="px-4 pt-2 pb-4"
          flat
          :color="$vuetify.theme.dark ? '' : '#F5F5F5'"
        >
          <div class="overline text--secondary pb-1">TEXT POST</div>
          <Editor editable autofocus menubar />
        </v-card>
      </client-only>
    </v-col>
  </v-row>
</template>

<script>
import Editor from '../../../components/editor/Editor'
export default {
  components: { Editor }
}
</script>

<style scoped></style>
