import Vue from 'vue'
import Router from 'vue-router'
import PostView from './components/views/PostView'
import HomeView from './components/views/HomeView'
import UserView from './components/views/UserView'
import TopicView from './components/views/TopicView'
import ComposeView from './components/views/ComposeView'
import FiltersView from './components/views/FiltersView'
import ContentPolicyView from './components/views/ContentPolicyView'
import PrivacyPolicyView from './components/views/PrivacyPolicyView'
import TermsOfServiceView from './components/views/TermsOfServiceView'
import SearchView from './components/views/SearchView'
import SettingsView from './components/views/SettingsView'
import TopicsView from './components/views/TopicsView'
import NotificationsView from './components/views/NotificationsView'
import LoginView from './components/views/LoginView'

Vue.use(Router)

if (process.client) {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
    // reset scrollRestoration to auto when leaving page, allowing page reload
    // and back-navigation from other pages to use the browser to restore the
    // scrolling position.
    window.addEventListener('beforeunload', () => {
      window.history.scrollRestoration = 'auto'
    })
    // Setting scrollRestoration to manual again when returning to this page.
    window.addEventListener('load', () => {
      window.history.scrollRestoration = 'manual'
    })
  }
}

export function createRouter() {
  return new Router({
    scrollBehavior(to, from, savedPosition) {
      let position
      // Your Code Starts Here
      position = savedPosition || { x: 0, y: 0 }
      // Your Code Ends Here
      const nuxt = window.$nuxt
      // triggerScroll is only fired when a new component is loaded
      if (to.path === from.path && to.hash !== from.hash) {
        nuxt.$nextTick(() => nuxt.$emit('triggerScroll'))
      }
      return new Promise((resolve) => {
        // wait for the out transition to complete (if necessary)
        nuxt.$once('triggerScroll', () => {
          // coords will be used if no selector is provided,
          // or if the selector didn't match any element.
          if (to.hash) {
            let hash = to.hash
            // CSS.escape() is not supported with IE and Edge.
            if (
              typeof window.CSS !== 'undefined' &&
              typeof window.CSS.escape !== 'undefined'
            ) {
              hash = '#' + window.CSS.escape(hash.substr(1))
            }
            try {
              if (document.querySelector(hash)) {
                // scroll to anchor by returning the selector
                position = { selector: hash }
              }
            } catch (e) {
              /* console.warn(
                'Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).'
              ) */
            }
          }
          resolve(position)
        })
      })
    },
    mode: 'history',
    routes: [
      {
        path: '/',
        component: HomeView,
        name: 'Home'
      },
      {
        path: '/u/:username',
        component: UserView,
        name: 'User'
      },
      {
        path: '/post/:postId/:urlName?',
        component: PostView,
        name: 'Post'
      },
      {
        path: '/topic/:topicName',
        component: TopicView,
        name: 'Topic'
      },
      {
        path: '/topics',
        component: TopicsView,
        name: 'Topics'
      },
      {
        path: '/new',
        component: ComposeView,
        name: 'Compose'
      },
      {
        path: '/filters',
        component: FiltersView,
        name: 'Filters'
      },
      {
        path: '/notifications',
        component: NotificationsView,
        name: 'Notifications'
      },
      {
        path: '/search',
        component: SearchView,
        name: 'Search'
      },
      {
        path: '/settings',
        component: SettingsView,
        name: 'Settings'
      },
      {
        path: '/login',
        component: LoginView,
        name: 'Login'
      },
      {
        path: '/content-policy',
        component: ContentPolicyView,
        name: 'Content Policy'
      },
      {
        path: '/privacy-policy',
        component: PrivacyPolicyView,
        name: 'Privacy Policy'
      },
      {
        path: '/terms-of-service',
        component: TermsOfServiceView,
        name: 'Terms of Service'
      }
    ]
  })
}
