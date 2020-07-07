<template>
  <v-menu offset-y open-on-hover>
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <nuxt-link :to="`/u/${source.author.username}`" class="text--primary">
          <v-avatar size="24" color="grey darken-3">
            <img
              src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          /></v-avatar>
          <span class="ml-1" style="font-size: .75rem">
            {{ source.author.username }}
          </span>
        </nuxt-link>
      </span>
    </template>

    <v-card>
      <ApolloQuery
        :query="require('../gql/user.graphql')"
        :variables="{ username: source.author.username }"
      >
        <template v-slot="{ result: { loading, error, data } }">
          <div v-if="!data" class="pa-4">
            <v-row align="center" justify="center">
              <v-progress-circular indeterminate />
            </v-row>
          </div>

          <div v-else>
            <v-list-item>
              <v-list-item-avatar>
                <v-img
                  src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ data.user.username }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </template>
      </ApolloQuery>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'UsernameMenu',
  props: {
    source: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
