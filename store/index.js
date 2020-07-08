import currentUserGql from '../gql/currentUser.graphql'

export const state = () => ({
  currentUser: null,
  homeFeedPage: 0,
  topicFeedPage: {},
  topicSidebarSelected: 'Popular',
  topicSidebarSearchText: '',
  snackbarEnabled: false,
  snackbarMessage: '',
  snackbarSuccess: false,
  searchPage: 0,
  homeQuery: {},
  expandedCommentId: '',
  currentPostTitle: '',
  currentPostComments: 0
})

export const mutations = {
  setCurrentUser(state, currentUser) {
    state.currentUser = currentUser
  },
  setCurrentPostTitle(state, title) {
    state.currentPostTitle = title
  },
  setCurrentPostComments(state, comments) {
    state.currentPostComments = comments
  },
  setExpandedCommentId(state, commentId) {
    state.expandedCommentId = commentId
  },
  setHomeQuery(state, query) {
    state.homeQuery = query
  },
  setHomeFeedPage(state, page) {
    state.homeFeedPage = page
  },
  setTopicFeedPage(state, obj) {
    state.topicFeedPage[obj.topicName] = obj.page
  },
  setTopicSidebarSelected(state, selected) {
    state.topicSidebarSelected = selected
  },
  setTopicSidebarSearchText(state, searchText) {
    state.topicSidebarSearchText = searchText
  },
  setSnackbarEnabled(state, enabled) {
    state.snackbarEnabled = enabled
  },
  setSnackbarMessage(state, message) {
    state.snackbarMessage = message
  },
  setSnackbarSuccess(state, success) {
    state.snackbarSuccess = success
  },
  setSearchPage(state, page) {
    state.searchPage = page
  }
}

export const actions = {
  async nuxtServerInit({ commit }, context) {
    if (!context.app.$apolloHelpers.getToken()) return
    const client = context.app.apolloProvider.defaultClient
    const { data } = await client.query({ query: currentUserGql })
    commit('setCurrentUser', data.currentUser)
    if (!data.currentUser) {
      await context.app.$apolloHelpers.onLogout()
    }
  },
  async fetchCurrentUser({ commit }) {
    if (!this.app.$apolloHelpers.getToken()) {
      commit('setCurrentUser', null)
      return
    }
    const client = this.app.apolloProvider.defaultClient
    const { data } = await client.query({ query: currentUserGql })
    commit('setCurrentUser', data.currentUser)
  },
  displaySnackbar({ commit }, { message, success = false }) {
    commit('setSnackbarMessage', message)
    commit('setSnackbarEnabled', true)
    commit('setSnackbarSuccess', success)
    setTimeout(() => {
      commit('setSnackbarEnabled', false)
    }, 5000)
  }
}
