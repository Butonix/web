export const state = () => ({
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
  displaySnackbar({ commit }, { message, success = false }) {
    commit('setSnackbarMessage', message)
    commit('setSnackbarEnabled', true)
    commit('setSnackbarSuccess', success)
    setTimeout(() => {
      commit('setSnackbarEnabled', false)
    }, 5000)
  }
}
