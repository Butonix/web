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
  mdiCheckAll,
  mdiMusic,
  mdiEarth,
  mdiEarthPlus,
  mdiControllerClassic,
  mdiCamera,
  mdiEmoticonExcited,
  mdiMovie,
  mdiPill,
  mdiWeightLifter,
  mdiCommentTextMultiple,
  mdiDevices,
  mdiCashUsdOutline,
  mdiNaturePeople,
  mdiBasketball,
  mdiFood,
  mdiMicroscope,
  mdiFeather,
  mdiImageFrame,
  mdiSchool,
  mdiBookshelf,
  mdiTshirtCrew,
  mdiCity,
  mdiHelpCircle
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
      { name: 'theme-color', content: '#202124' }
      /* {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent'
      } */
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/css/fonts.css', '~/css/main.css', '~/css/main.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/vue-clipboard2.client.js'],
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
      theme_color: '#202124',
      background_color: '#202124',
      fileName: 'manifest.[ext]?[hash]',
      start_url: '/'
    },
    meta: {
      name: 'Comet',
      description: 'Create and browse posts and comments on Comet',
      theme_color: '#202124',
      favicon: false
    },
    icon: {
      purpose: ['any', 'maskable']
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
        mdiCheckAll,
        mdiMusic,
        mdiEarth,
        mdiEarthPlus,
        mdiControllerClassic,
        mdiCamera,
        mdiEmoticonExcited,
        mdiMovie,
        mdiPill,
        mdiWeightLifter,
        mdiCommentTextMultiple,
        mdiDevices,
        mdiCashUsdOutline,
        mdiNaturePeople,
        mdiBasketball,
        mdiFood,
        mdiMicroscope,
        mdiFeather,
        mdiImageFrame,
        mdiSchool,
        mdiBookshelf,
        mdiTshirtCrew,
        mdiCity,
        mdiHelpCircle
      }
    },
    theme: {
      options: {
        customProperties: true
      },
      dark: true,
      themes: {
        dark: {
          primary: '#EF5350',
          error: '#F44336',
          success: '#43A047'
        },
        light: {
          primary: '#EF5350',
          error: '#F44336',
          success: '#43A047'
        }
      }
    }
  },

  serverMiddleware: [
    redirectSSL.create({
      enabled: process.env.NODE_ENV === 'production'
    })
  ],

  build: {
    cache: true,
    parallel: true,
    extend(config, ctx) {
      config.externals = [{ newrelic: 'newrelic' }]
    }
  }
}
