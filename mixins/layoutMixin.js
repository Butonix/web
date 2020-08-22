export default {
  watch: {
    '$vuetify.theme.dark'() {
      if (!process.client) return
      document.documentElement.style.backgroundColor = this.$vuetify.theme.dark
        ? '#202124'
        : '#F1F3F4'
      document.querySelector('body').style.backgroundColor = this.$vuetify.theme
        .dark
        ? '#202124'
        : '#F1F3F4'
    }
  },
  beforeCreate() {
    // const mq = window.matchMedia('(prefers-color-scheme: dark)')

    if (process.client) {
      const dark = localStorage.getItem('dark')
      if (dark) {
        this.$vuetify.theme.dark = dark === 'true'
      } else {
        this.$vuetify.theme.dark = true
      }
    }

    /* mq.addEventListener('change', (e) => {
      if (!localStorage.getItem('dark')) {
        this.$vuetify.theme.dark = e.matches
      }
    }) */
  },
  beforeMount() {
    document.documentElement.style.backgroundColor = this.$vuetify.theme.dark
      ? '#202124'
      : '#F1F3F4'
    document.querySelector('body').style.backgroundColor = this.$vuetify.theme
      .dark
      ? '#202124'
      : '#F1F3F4'
  },
  head() {
    return {
      meta: [
        {
          name: 'theme-color',
          content: this.$vuetify.theme.dark ? '#202124' : '#F1F3F4'
        }
      ]
    }
  }
}
