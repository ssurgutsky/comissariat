<template>
  <div>
    <video :style="styleObject1" playsinline :loop="loop" ref="videoPlayer1" @canplay="onCanPlay" @ended="onEnd">
      <source type="video/mp4" />
    </video>
    <video :style="styleObject2" playsinline :loop="loop" ref="videoPlayer2" @canplay="onCanPlay" @ended="onEnd">
      <source type="video/mp4" />
    </video>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  data () {
    return {
      videoPlayer1: null,
      videoPlayer2: null,
      currentVideoPlayer: null,
      currentPlayerNo: 1,
      currentVideoName: '',
      loop: false,
      styleObject1: {
        display: 'auto',
        'object-fit': 'contain',
        'min-height': '100%',
        'max-width': '100%',
        'margin': 'auto'
      },
      styleObject2: {
        display: 'none',
        'object-fit': 'contain',
        'min-height': '100%',
        'max-width': '100%',
        'margin': 'auto'
      }
    }
  },
  mounted () {
    if (!this.videoPlayer1) {
      this.initialize()
    }
  },
  methods: {
    initialize () {
      // console.log(this.$refs)
      this.videoPlayer1 = this.$refs.videoPlayer1
      this.videoPlayer2 = this.$refs.videoPlayer2
    },

    playVideo (name, loop) {
      console.log(name)

      this.currentVideoName = name

      if (name.toUpperCase() === 'NONE') {
        this.styleObject1.display = 'none'
        this.videoPlayer1.src = ''
        this.styleObject2.display = 'none'
        this.videoPlayer2.src = ''
        //        this.onEnd()
        return
      }

      if (this.currentPlayerNo === 1) {
        this.videoPlayer1.loop = loop
        this.videoPlayer1.src = require('@/assets/video/' + name + '.mp4')
      }

      if (this.currentPlayerNo === 2) {
        this.videoPlayer2.loop = loop
        this.videoPlayer2.src = require('@/assets/video/' + name + '.mp4')
      }
    },

    stopVideo () {
      if (this.currentPlayerNo === 1) {
        this.videoPlayer1.pause()
      }

      if (this.currentPlayerNo === 2) {
        this.videoPlayer2.pause()
      }
    },

    onCanPlay (event) {
      // console.log('canPlay')

      if (this.currentPlayerNo === 1) {
        this.videoPlayer1.play()
        this.styleObject1.display = 'flex'
        this.styleObject2.display = 'none'
        this.videoPlayer2.src = ''
        this.currentVideoPlayer = this.videoPlayer1
      }

      if (this.currentPlayerNo === 2) {
        this.videoPlayer2.play()
        this.styleObject2.display = 'flex'
        this.styleObject1.display = 'none'
        this.videoPlayer1.src = ''
        this.currentVideoPlayer = this.videoPlayer2
      }

      this.currentPlayerNo = 3 - this.currentPlayerNo
    },

    onEnd () {
      //      console.log('videoEnded', this.currentVideoName)
      this.$emit('videoEnded', this.currentVideoName)
    }
  }
}
</script>

<style scoped>
</style>
