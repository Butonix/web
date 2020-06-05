import Vue from 'vue'
import Router from 'vue-router'
import PostView from './components/views/PostView'
import HomeView from './components/views/HomeView'
import UserView from './components/views/UserView'
import TopicView from './components/views/TopicView'
import ComposeView from './components/views/ComposeView'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: HomeView,
        name: 'Home'
      },
      {
        path: '/user/:username',
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
        path: '/new',
        component: ComposeView,
        name: 'Compose'
      }
    ]
  })
}
