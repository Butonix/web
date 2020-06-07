export const state = () => ({
  loginDialog: false,
  redirectLoginDialogToCompose: false,
  homeFeedPage: 0,
  topicFeedPage: {},
  topicSidebarSelected: 'Popular',
  topicSidebarSearchText: ''
})

export const mutations = {
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
  }
}
