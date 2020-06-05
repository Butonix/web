import Vue from 'vue'

// the properties of breakpoint that we want to mirror
const defaults = {
  xs: false,
  xsOnly: false,
  sm: false,
  smOnly: false,
  smAndDown: false,
  smAndUp: true,
  md: false,
  mdOnly: false,
  mdAndDown: true,
  mdAndUp: true,
  lg: false,
  lgOnly: false,
  lgAndDown: false,
  lgAndUp: true,
  xl: true,
  xlOnly: false
}

// create a property on the prototype of all instances that holds the breakpoint state
Vue.prototype.$breakpoint = new Vue({
  data: () => ({ ...defaults })
})

export default async function({ app }) {
  // init mixins and the watchers if they don't exist yet
  app.mixins = app.mixins || []
  app.watch = app.watch || {}

  // create a watcher for each breakpoint
  for (const prop in defaults) {
    // the watcher sets the breakpoint prop to cause an update
    app.watch[`$vuetify.breakpoint.${prop}`] = function(value) {
      // update our mirrored value properly
      this.$breakpoint[prop] = value
    }
  }

  // add a mixin that does the client prop setting
  app.mixins.push({
    // here is the magic, if we set the state with the correct value on client init it works
    mounted() {
      // for all props that we are processing
      for (const prop in defaults) {
        // set the initial value from vuetify
        this.$breakpoint[prop] = this.$vuetify.breakpoint[prop]
      }
    }
  })
}
