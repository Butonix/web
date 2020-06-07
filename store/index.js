export const state = () => ({
  loginDialog: false,
  redirectLoginDialogToCompose: false,
  homeFeedPage: 0,
  topicFeedPage: {}
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
  }
}
