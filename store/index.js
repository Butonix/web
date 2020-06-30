export const state = () => ({
  homeFeedPage: 0,
  topicFeedPage: {},
  topicSidebarSelected: 'Popular',
  topicSidebarSearchText: '',
  snackbarEnabled: false,
  snackbarMessage: '',
  searchPage: 0,
  homeQuery: {},
  expandedCommentId: '',
  currentPostTitle: ''
})

export const mutations = {
  setCurrentPostTitle(state, title) {
    state.currentPostTitle = title
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
  setSearchPage(state, page) {
    state.searchPage = page
  }
}

export const actions = {
  displaySnackbar({ commit }, message) {
    commit('setSnackbarMessage', message)
    commit('setSnackbarEnabled', true)
    setTimeout(() => {
      commit('setSnackbarEnabled', false)
      commit('setSnackbarMessage', '')
    }, 5000)
  }
}
