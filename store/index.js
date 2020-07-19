import currentUserGql from '../gql/currentUser.graphql'

export const state = () => ({
  currentUser: null,
  topicSidebarSelected: 'Popular',
  topicSidebarSearchText: '',
  snackbarEnabled: false,
  snackbarMessage: '',
  snackbarSuccess: false,
  homeQuery: {},
  topicQuery: {},
  userQuery: {},
  expandedCommentId: ''
})

export const mutations = {
  setCurrentUser(state, currentUser) {
    state.currentUser = currentUser
  },
  setExpandedCommentId(state, commentId) {
    state.expandedCommentId = commentId
  },
  setHomeQuery(state, query) {
    state.homeQuery = query
  },
  setTopicQuery(state, query) {
    state.topicQuery = query
  },
  setUserQuery(state, query) {
    state.userQuery = query
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
    const { data } = await client.query({
      query: currentUserGql,
      fetchPolicy: 'network-only'
    })
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
