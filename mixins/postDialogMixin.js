import feedGql from '@/gql/feed'

export default {
  data() {
    return {
      feed: [],
      hasMore: true,
      page: 0,
      dialog: false,
      selectedPost: null
    }
  },
  apollo: {
    feed: {
      query: feedGql,
      variables() {
        return {
          ...this.vars
        }
      },
      fetchPolicy: 'network-only'
    }
  },
  computed: {
    vars() {
      return {
        sort: this.$route.params.sort
          ? this.$route.params.sort.toUpperCase()
          : 'HOT',
        time: this.$route.params.time
          ? this.$route.params.time.toUpperCase()
          : 'ALL',
        filter: this.$route.name.startsWith('sort-time') ? 'MYPLANETS' : 'ALL',
        types:
          this.$route.query && this.$route.query.types
            ? this.$route.query.types.split('-').map((t) => t.toUpperCase())
            : [],
        planetName: this.$route.params.planetname,
        galaxyName: this.$route.params.galaxyname,
        username: this.$route.params.username,
        search: this.$route.query.q
      }
    }
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.hideDialog()
        if (process.client) {
          window.document.documentElement.style.overflowY = 'scroll'
        }
      } else if (process.client) {
        window.document.documentElement.style.overflowY = 'hidden'
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'p-planetname-comments-id-title') {
      if (!this.dialog) {
        this.displayDialog(to)
      } else if (this.$device.isDesktop) {
        window.history.back()
        this.hideDialog()
      }
    } else {
      next()
    }
  },
  methods: {
    displayDialog(route) {
      window.history.pushState({}, null, route.path)
      this.selectedPost = this.feed.find((p) => p.id === route.params.id)
      this.dialog = true
    },
    hideDialog() {
      this.dialog = false
    },
    toggleHidden() {
      this.$apollo.provider.defaultClient.cache.writeQuery({
        query: feedGql,
        variables: {
          ...this.vars
        },
        data: { feed: this.feed.filter((p) => !p.isHidden) }
      })
    },
    toggleBlock() {
      this.$apollo.provider.defaultClient.cache.writeQuery({
        query: feedGql,
        variables: {
          ...this.vars
        },
        data: { feed: this.feed.filter((p) => !p.author.isBlocking) }
      })
    },
    handleScroll(e) {
      if (!process.client) return
      const totalPageHeight = document.body.scrollHeight
      const scrollPoint = window.scrollY + window.innerHeight
      if (scrollPoint >= totalPageHeight - 3000) {
        this.showMore()
      }
    },
    showMore() {
      if (this.$apollo.queries.feed.loading || !this.hasMore) return
      this.page++
      this.$apollo.queries.feed.fetchMore({
        query: feedGql,
        variables: {
          page: this.page,
          ...this.vars
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.feed
          if (newPosts.length === 0) this.hasMore = false
          return {
            feed: [...previousResult.feed, ...newPosts]
          }
        }
      })
    }
  }
}
