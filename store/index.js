export const state = () => ({
  loginDialog: false,
  redirectLoginDialogToCompose: false
})

export const mutations = {
  setLoginDialog(state, open) {
    state.loginDialog = open
  },
  setRedirectLoginDialogToCompose(state, redirect) {
    state.redirectLoginDialogToCompose = redirect
  }
}
