<template>
  <div>
    <audio playsinline autoplay muted :loop="loop" ref="audioPlayer" @ended="onEnd">
      <source type="audio/mp3" />
    </audio>
    <audio playsinline autoplay muted ref="ambientPlayer">
      <source type="audio/mp3" />
    </audio>
    <audio playsinline autoplay muted ref="musicPlayer">
      <source type="audio/mp3" />
    </audio>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  name: 'AudioPlayer',
  data () {
    return {
      audioPlayer: null,
      ambientPlayer: null,
      musicPlayer: null,
      currentAudioName: '',
      currentAmbientName: '',
      currentMusicName: '',
      silentTimerId: 0,
      loop: false
    }
  },
  mounted () {
    if (!this.audioPlayer) {
      this.initialize()
    }
  },
  methods: {
    initialize () {
      this.audioPlayer = this.$refs.audioPlayer
      this.ambientPlayer = this.$refs.ambientPlayer
      this.musicPlayer = this.$refs.musicPlayer
    },

    playAudio (name, loop) {
      console.log(name)

      this.clearSilentTimer()

      this.currentAudioName = name

      if (name.toUpperCase().includes('SILENT_')) {
        let seconds = name.toUpperCase().replace('SILENT_', '')
        this.silentTimerId = setTimeout(this.onEnd, seconds * 1000)
        return
      }
      this.audioPlayer.loop = loop
      this.audioPlayer.src = require('@/assets/audio/' + name + '.mp3')
    },

    stopAudio () {
      this.audioPlayer.pause()
    },

    clearSilentTimer () {
      clearTimeout(this.silentTimerId)
      this.silentTimerId = 0
    },

    onEnd () {
      //      console.log('audioEnded', this.currentAudioName)
      this.$emit('audioEnded', this.currentAudioName)
    },

    playAmbient (name) {
      // console.log(name)

      if (name === '' || name === this.currentAmbientName) {
        return
      }

      this.currentAmbientName = name

      if (name.toUpperCase() === 'NONE' || name.toUpperCase() === 'OFF') {
        this.ambientPlayer.src = ''
        return
      }

      this.ambientPlayer.loop = true
      this.ambientPlayer.src = require('@/assets/audio/' + name + '.mp3')
    },

    playMusic (name) {
      // console.log(name)

      if (name === '' || name === this.currentMusicName) {
        return
      }

      this.currentMusicName = name

      if (name.toUpperCase() === 'NONE' || name.toUpperCase() === 'OFF') {
        this.musicPlayer.src = ''
        return
      }

      this.musicPlayer.loop = true
      this.musicPlayer.src = require('@/assets/audio/' + name + '.mp3')
    }
  }
}
</script>

<style scoped>
</style>
