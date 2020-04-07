<template>
  <div ref="mainView" class="main-view">
    <VideoPlayer class="video-container" ref="videoPlayer" @videoEnded="processVideoEnded"/>
    <ImagePlayer class="image-container" ref="imagePlayer"/>
    <AudioPlayer class="audio-container" ref="audioPlayer" @audioEnded="processAudioEnded"/>
    <QuestionView class="questions-container" ref="questionView"/>
    <TimerView class="timer-container" ref="timerView" @timeExpired="processTimeExpired" />
    <AnswersList class="answers-container" ref="answersView" @answerClick="processAnswerClick" />
    <ControlsView class="controls-container" ref="controlsView"
      @restartGame="restartGame"
      @cheatSkip="cheatSkip"
      @cheatBack="cheatBack"
      @cheatEpisode="cheatEpisode"
    />
  </div>
</template>

<script>
import VideoPlayer from './VideoPlayer.vue'
import ImagePlayer from './ImagePlayer.vue'
import AudioPlayer from './AudioPlayer.vue'
import TimerView from './TimerView.vue'
import QuestionView from './QuestionView.vue'
import AnswersList from './AnswersList.vue'
import ControlsView from './ControlsView.vue'

export default {
  components: {
    VideoPlayer,
    ImagePlayer,
    AudioPlayer,
    TimerView,
    QuestionView,
    AnswersList,
    ControlsView
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {

    },

    setQuestionText (txt) {
      this.$refs.questionView.setQuestion(txt)
    },

    showAnswers (items) {
      this.$refs.answersView.setAnswers(items)
      this.$refs.answersView.showAnswers()
    },

    clearAnswers () {
      this.$refs.answersView.setAnswers([])
      this.$refs.answersView.hideAnswers()
    },

    setTimer (seconds) {
      this.$refs.timerView.setTimer(seconds)
    },

    clearTimer (seconds) {
      this.$refs.timerView.clearTimer()
    },

    playVideo (name, loop) {
      this.$refs.videoPlayer.playVideo(name, loop)
    },

    playAudio (name, loop) {
      this.$refs.audioPlayer.playAudio(name, loop)
    },

    showBgndImage (name) {
      this.$refs.imagePlayer.showBgndImage(name)
    },

    clearBgndImage (name) {
      this.$refs.imagePlayer.clearBgndImage()
    },

    playAmbient (name, loop) {
      this.$refs.audioPlayer.playAmbient(name)
    },

    playMusic (name, loop) {
      this.$refs.audioPlayer.playMusic(name)
    },

    stopVideo () {
      this.$refs.videoPlayer.stopVideo()
    },

    stopAudio () {
      this.$refs.audioPlayer.stopAudio()
    },

    processAnswerClick (item) {
      // console.log(item)
      this.$emit('answerClick', item)
    },

    processVideoEnded (name) {
      // console.log('videoEnded', name)
      this.$emit('videoEnded', name)
    },

    processAudioEnded (name) {
      // console.log('audioEnded', name)
      this.$emit('audioEnded', name)
    },

    processTimeExpired () {
      // console.log('timeExpired')
      this.$emit('timeExpired')
    },

    restartGame () {
      this.$emit('restartGame')
    },

    /* CHEATS */
    cheatSkip () {
      this.$emit('cheatSkip')
    },

    cheatBack () {
      this.$emit('cheatBack')
    },

    cheatEpisode () {
      console.log('cheatEpisode')
      this.$emit('cheatEpisode')
    }
  }
}
</script>

<style scoped>

  .main-view {
    overflow: none;
  }
  .audio-container {
    display: none;
  }

  @media (orientation: portrait) {
    .video-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 50vh;
      margin: 0;
      padding: 0;
      z-index: -2;
    }

    .image-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 50vh;
      margin: 0;
      padding: 0;
      z-index: -1;
    }

    .questions-container {
      position: fixed;
      top: 51vh;
      left: 0;
      width: 100%;
      height: 19vh;
    }

    .timer-container {
      position: fixed;
      top: 70vh;
      left: 0;
      width: 100%;
      height: 1vh;
    }

    .answers-container {
      position: fixed;
      top: 72vh;
      left: 0;
      width: 100%;
      height: 20vh;
    }

    .controls-container {
      position: fixed;
      top: 94vh;
      left: 0;
      width: 100%;
      height: 4vh;
    }
  }

  @media (orientation: landscape) {
    .video-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 50vw;
      height: 100%;
      margin: 0;
      padding: 0;
      z-index: -2;
    }

    .image-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 50vw;
      height: 100%;
      margin: 0;
      padding: 0;
      z-index: -1;
    }

    .questions-container {
      position: fixed;
      top: 5vh;
      left: 51vw;
      width: 48vw;
      height: 40vh;
    }

    .timer-container {
      position: fixed;
      top: 48vh;
      left: 50vw;
      width: 48vw;
      height: 1vh;
    }

    .answers-container {
      position: fixed;
      top: 52vh;
      left: 51vw;
      width: 48vw;
      height: 35vh;
    }

    .controls-container {
      position: fixed;
      top: 90vh;
      left: 51vw;
      width: 48vw;
      height: 4vh;
    }
  }
</style>
