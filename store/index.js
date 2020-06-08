export const state = () => ({
  loginDialog: false,
  redirectLoginDialogToCompose: false,
  homeFeedPage: 0,
  topicFeedPage: {},
  topicSidebarSelected: 'Popular',
  topicSidebarSearchText: '',
  snackbarEnabled: false,
  snackbarMessage: '',
  searchPage: 0,
  homeQuery: {}
})

export const mutations = {
  setHomeQuery(state, query) {
    state.homeQuery = query
  },
  setLoginDialog(state, open) {
    state.loginDialog = open
  },
  setRedirectLoginDialogToCompose(state, redirect) {
    state.redirectLoginDialogToCompose = redirect
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
  setSearchPage(state, page) {
    state.searchPage = page
  }
}

export const actions = {
  showLoginDialog({ commit }) {
    commit('setLoginDialog', true)
    commit('setRedirectLoginDialogToCompose', false)
  },
  showLoginDialogCompose({ commit }) {
    commit('setLoginDialog', true)
    commit('setRedirectLoginDialogToCompose', true)
  },
  displaySnackbar({ commit }, message) {
    commit('setSnackbarMessage', message)
    commit('setSnackbarEnabled', true)
    setTimeout(() => {
      commit('setSnackbarEnabled', false)
      commit('setSnackbarMessage', '')
    }, 5000)
  }
}
