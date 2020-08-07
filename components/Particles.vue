<template>
  <div :id="id" class="particles-js"></div>
</template>

<script>
export default {
  name: 'Particles',
  data() {
    return {
      id: 'particles-instance-' + Math.floor(Math.random() * 5000)
    }
  },
  watch: {
    '$vuetify.theme.themes.dark.primary'(val) {
      this.destroyParticleJS()

      this.$nextTick(() => {
        this.initParticleJS()
      })
    }
  },
  beforeDestroy() {
    this.destroyParticleJS()
  },
  mounted() {
    this.destroyParticleJS()

    require('particles.js')
    this.$nextTick(() => {
      this.initParticleJS()
    })
  },
  methods: {
    destroyParticleJS() {
      if (Array.isArray(window.pJSDom) && window.pJSDom.length > 0) {
        for (let i = 0; i < window.pJSDom.length; i++)
          window.pJSDom[i].pJS.fn.vendors.destroypJS()
        window.pJSDom = []
      }
    },
    initParticleJS() {
      // eslint-disable-next-line no-undef
      particlesJS(this.id, {
        particles: {
          number: {
            value: 160,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: this.$vuetify.theme.themes.dark.primary
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000'
            },
            polygon: {
              nb_sides: 5
            },
            image: {
              src: 'img/github.svg',
              width: 100,
              height: 100
            }
          },
          opacity: {
            value: 1,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0,
              sync: false
            }
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: false,
              speed: 4,
              size_min: 0.3,
              sync: false
            }
          },
          line_linked: {
            enable: false,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 600
            }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: false,
              mode: 'bubble'
            },
            onclick: {
              enable: false,
              mode: 'repulse'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1
              }
            },
            bubble: {
              distance: 250,
              size: 0,
              duration: 2,
              opacity: 0,
              speed: 3
            },
            repulse: {
              distance: 400,
              duration: 0.4
            },
            push: {
              particles_nb: 4
            },
            remove: {
              particles_nb: 2
            }
          }
        },
        retina_detect: true
      })
    }
  }
}
</script>

<style lang="scss">
div[id^='particles-instance-'] {
  height: 100vh !important;
  width: 100vw !important;
  position: fixed !important;
  top: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  background: rgba($color: #202124, $alpha: 0);
  z-index: 0 !important;
}
</style>
