<template>
  <div>
    <img :style="styleObject" ref="imagePlayer">
  </div>
</template>

<script>
export default {
  name: 'ImagePlayer',
  data () {
    return {
      imagePlayer: null,
      currentImageName: '',
      styleObject: {
        'display': 'none',
        'object-fit': 'contain',
        'height': '100%',
        'width': '100%',
        'margin': 'auto'
      }
    }
  },
  mounted () {
    if (!this.imagePlayer) {
      this.initialize()
    }
  },
  methods: {
    initialize () {
      // console.log(this.$refs)
      this.imagePlayer = this.$refs.imagePlayer
    },

    showBgndImage (name) {
      console.log('showBgndImage', name)
      this.imagePlayer.src = require('@/assets/images/' + name)
      this.styleObject.display = 'flex'
      this.currentImageName = name
    },

    clearBgndImage () {
      // console.log('clearBgndImage', this.currentImageName)
      this.styleObject.display = 'none'
      this.imagePlayer.src = ''
      this.currentImageName = ''
    }
  }
}
</script>

<style scoped>
</style>
