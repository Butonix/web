import colors from 'vuetify/lib/util/colors'
import redirectSSL from 'redirect-ssl'
import {
  mdiImage,
  mdiImageOutline,
  mdiTextBox,
  mdiTextBoxOutline,
  mdiLinkBox,
  mdiLinkBoxOutline,
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronUp,
  mdiChevronDown,
  mdiFormatBold,
  mdiFormatItalic,
  mdiFormatStrikethrough,
  mdiFormatQuoteClose,
  mdiFormatListNumbered,
  mdiFormatListBulleted,
  mdiClockTimeOneOutline,
  mdiHome,
  mdiAccountOutline,
  mdiBellOutline,
  mdiPencil,
  mdiMagnify,
  mdiNewspaper,
  mdiFire,
  mdiCommentOutline,
  mdiRocket,
  mdiPlusBox,
  mdiShareOutline,
  mdiDotsVertical,
  mdiInfinity,
  mdiText,
  mdiLink,
  mdiCodeTags,
  mdiEmoticonFrown,
  mdiWeatherNight,
  mdiLogin,
  mdiLogout,
  mdiEye,
  mdiEyeOff,
  mdiTrashCan,
  mdiAlertOctagonOutline,
  mdiCogOutline,
  mdiReply,
  mdiFilterVariant,
  mdiShare,
  mdiContentCopy,
  mdiOpenInNew,
  mdiComment,
  mdiMessageReply,
  mdiWeb,
  mdiPost,
  mdiPostOutline,
  mdiDiscord,
  mdiStar,
  mdiAccountPlusOutline,
  mdiAccountCheckOutline,
  mdiAccountCancelOutline,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiMinus,
  mdiFormatUnderline,
  mdiCodeNotEqualVariant,
  mdiClose,
  mdiCloseCircleOutline,
  mdiCloseCircle,
  mdiTelescope,
  mdiPlusBoxOutline,
  mdiLinkOff,
  mdiAccountMultiple,
  mdiAccountMultipleOutline,
  mdiCommentMultiple,
  mdiCommentMultipleOutline,
  mdiShuffleVariant,
  mdiFace,
  mdiPlus,
  mdiCheck,
  mdiClipboardAccount,
  mdiNewspaperPlus,
  mdiNewspaperMinus,
  mdiTrendingUp,
  mdiCheckCircleOutline,
  mdiCheckAll
} from '@mdi/js'

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s / Comet',
    title: 'Home',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      { name: 'theme-color', content: '#F5F5F5' },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/css/main.css', '~/css/main.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/vue-clipboard2'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/vuetify', '@nuxtjs/pwa'],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/apollo', '@nuxtjs/device'],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    progress: false,
    baseURL: process.env.BASE_URL
      ? process.env.BASE_URL
      : 'http://localhost:4000'
  },

  pwa: {
    manifest: {
      name: 'Comet',
      short_name: 'Comet',
      description: 'Create and browse posts and comments on Comet',
      theme_color: '#F5F5F5',
      background_color: '#F5F5F5'
    },
    meta: {
      name: 'Comet',
      description: 'Create and browse posts and comments on Comet',
      theme_color: '#F5F5F5'
    }
  },

  /*
   ** Apollo module configuration
   ** See https://github.com/nuxt-community/apollo-module
   */
  apollo: {
    cookieAttributes: {
      secure: process.env.NODE_ENV === 'production'
    },
    // required
    clientConfigs: {
      default: {
        // required
        httpEndpoint: process.env.BASE_URL
          ? `${process.env.BASE_URL}/graphql`
          : 'http://localhost:4000',
        // optional
        // See https://www.apollographql.com/docs/link/links/http.html#options
        httpLinkOptions: {
          credentials: 'same-origin'
        },
        // You can use `wss` for secure connection (recommended in production)
        // Use `null` to disable subscriptions
        wsEndpoint: null, // optional
        // LocalStorage token
        tokenName: 'apollo-token', // optional
        // Enable Automatic Query persisting with Apollo Engine
        persisting: false, // Optional
        // Use websockets for everything (no HTTP)
        // You need to pass a `wsEndpoint` for this to work
        websocketsOnly: false // Optional
      }
    }
  },

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    defaultAssets: false,
    icons: {
      iconfont: 'mdiSvg',
      values: {
        mdiImage,
        mdiImageOutline,
        mdiTextBox,
        mdiTextBoxOutline,
        mdiLinkBox,
        mdiLinkBoxOutline,
        mdiChevronLeft,
        mdiChevronRight,
        mdiChevronUp,
        mdiChevronDown,
        mdiFormatBold,
        mdiFormatItalic,
        mdiFormatStrikethrough,
        mdiFormatQuoteClose,
        mdiFormatListNumbered,
        mdiFormatListBulleted,
        mdiClockTimeOneOutline,
        mdiHome,
        mdiAccountOutline,
        mdiBellOutline,
        mdiPencil,
        mdiMagnify,
        mdiNewspaper,
        mdiFire,
        mdiCommentOutline,
        mdiRocket,
        mdiPlusBox,
        mdiShareOutline,
        mdiDotsVertical,
        mdiInfinity,
        mdiText,
        mdiLink,
        mdiCodeTags,
        mdiEmoticonFrown,
        mdiWeatherNight,
        mdiLogin,
        mdiLogout,
        mdiEye,
        mdiEyeOff,
        mdiTrashCan,
        mdiAlertOctagonOutline,
        mdiCogOutline,
        mdiReply,
        mdiFilterVariant,
        mdiShare,
        mdiContentCopy,
        mdiOpenInNew,
        mdiComment,
        mdiMessageReply,
        mdiWeb,
        mdiPost,
        mdiPostOutline,
        mdiDiscord,
        mdiStar,
        mdiAccountPlusOutline,
        mdiAccountCheckOutline,
        mdiAccountCancelOutline,
        mdiFormatHeader1,
        mdiFormatHeader2,
        mdiFormatHeader3,
        mdiMinus,
        mdiFormatUnderline,
        mdiCodeNotEqualVariant,
        mdiClose,
        mdiCloseCircleOutline,
        mdiCloseCircle,
        mdiTelescope,
        mdiPlusBoxOutline,
        mdiLinkOff,
        mdiAccountMultiple,
        mdiAccountMultipleOutline,
        mdiCommentMultiple,
        mdiCommentMultipleOutline,
        mdiShuffleVariant,
        mdiFace,
        mdiPlus,
        mdiCheck,
        mdiClipboardAccount,
        mdiNewspaperPlus,
        mdiNewspaperMinus,
        mdiTrendingUp,
        mdiCheckCircleOutline,
        mdiCheckAll
      }
    },
    theme: {
      options: {
        customProperties: true
      },
      dark: false,
      themes: {
        dark: {
          primary: colors.red.lighten1,
          accent: colors.red.lighten2,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.red.base,
          success: colors.green.darken1
        },
        light: {
          primary: colors.red.lighten1,
          accent: colors.red.lighten2,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.red.base,
          success: colors.green.darken1
        }
      }
    }
  },

  serverMiddleware: [
    redirectSSL.create({
      enabled: process.env.NODE_ENV === 'production'
    })
  ]
}
