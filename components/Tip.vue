<template>
  <div
    class="text--secondary unselectable"
    style="cursor: pointer"
    @click="nextTip"
    v-html="`Tip: ${currentTip}`"
  />
</template>

<script>
export default {
  name: 'Tip',
  data() {
    return {
      tips: [
        "Hover over a username to view a preview of the user's profile",
        'You can filter out text posts, links, and images from your feed by using the button to the left of the sort button',
        'Sorting by comments shows the posts with the most comments first',
        'Clicking the thumbnail of an image post will expand the image directly in your feed',
        'Fine-tune your feed hiding topics, hiding posts, and blocking users',
        'A single post can be submitted to up to 10 different topics',
        'Recent posts that receive a lot of rockets show up near the top of your feed when sorting by "hot"',
        'Sort by new to see the latest posts by Comet users',
        'The Comet bot continuously posts popular content from the internet',
        'Comet is mobile-friendly and can be installed on your device by pressing "Add to Home screen" or from the <a>Google Play Store</a>',
        'Join the <a href="https://discord.gg/NPCMGSm" target="_blank" rel="noopener">Comet Discord</a> to chat with fellow Comet users and developers',
        'Unblock users and unhide posts and topics by clicking your name at the top right of the page and going to "Filters"',
        'Block users by hovering over a username or going to a profile and clicking the block icon',
        'Hide topics by going to the topic page and clicking "Hide Topic"',
        'Posts that link to YouTube, Twitter, Spotify, or Instagram automatically displays the content on the post page so you do not have to leave Comet',
        'When writing comments and text posts, you have access to advanced formatting options',
        'Give rockets to posts you enjoy',
        'The popular topics tab shows the topics that have received the most posts in the past 24 hours',
        'If a post has received new comments since the last time you viewed the post, the number of new comments will be next to the total comment count, and new comments will be marked with "New"',
        'Add topics to "My Topics" by going to the topic page and clicking "Add to My Topics"',
        'Choose "My Topics" to only see posts from topics you have added to "My Topics"',
        'You receive notifications when someone responds to your posts or comments',
        'Toggle dark mode by clicking your username or "Log In" at the top right of the page and clicking "Dark Mode"',
        'ɟlǝsɯᴉɥ llᴉʞ ʇ,upᴉp uᴉǝʇsdƎ'
      ],
      tipIndex: 0
    }
  },
  computed: {
    currentTip() {
      return this.tips[this.tipIndex]
    }
  },
  created() {
    this.tipIndex = Math.floor(Math.random() * this.tips.length)
  },
  activated() {
    this.nextTip()
  },
  methods: {
    nextTip() {
      let newIndex = Math.floor(Math.random() * this.tips.length)
      while (newIndex === this.tipIndex) {
        newIndex = Math.floor(Math.random() * this.tips.length)
      }
      this.tipIndex = newIndex
    }
  }
}
</script>

<style scoped>
.text--secondary >>> a {
  color: var(--v-primary-base) !important;
}
</style>
