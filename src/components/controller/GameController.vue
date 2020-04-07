<template>
  <div>
    <MainView
      @answerClick="processAnswer"
      @videoEnded="processVideoEnded"
      @audioEnded="processAudioEnded"
      @restartGame="restartGame"
      @timeExpired="processTimeExpired"
      @cheatSkip="cheatSkip"
      @cheatBack="cheatBack"
      @cheatEpisode="cheatEpisode"
      ref="mainView">
    </MainView>
    <GameModel ref="gameModel"></GameModel>
  </div>
</template>

<script>
import MainView from '@/components/view/MainView.vue'
import GameModel from '@/components/model/GameModel.vue'

export default {
  components: {
    MainView,
    GameModel
  },
  data () {
    return {
      mainView: null,
      gameModel: null,

      mode: 0,
      MODE_QUESTION: 1,
      MODE_AFTER_QUESTION: 2,
      MODE_ANSWER: 3
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      this.mainView = this.$refs.mainView
      this.gameModel = this.$refs.gameModel

      this.restartGame()
    },

    restartGame () {
      console.log('Restart')
      this.mainView.clearTimer()
      this.gameModel.restartGame()
      this.showCurrentQuestion()
    },

    showCurrentQuestion () {
      this.gameModel.prepareCurrentQuestion()
      this.mainView.clearAnswers()

      console.log('Q:', this.gameModel.getCurrentQuestionLabel())

      this.mainView.setQuestionText(this.gameModel.getCurrentQuestionLabel())

      this.mode = this.MODE_QUESTION
      this.playVideoAndAudio()
      this.showBgndImage()
      this.playAmbient()
      this.playMusic()

      if (this.gameModel.getCurrentNavigateUrl()) {
        window.open(this.gameModel.getCurrentNavigateUrl(), '_blank')
      }
    },

    showAfterQuestion () {
      console.log('>>>after question')

      this.gameModel.prepareAfterQuestion()

      this.mode = this.MODE_AFTER_QUESTION

      this.playVideoAndAudio()
    },

    showCurrentAnswers () {
      if (this.gameModel.isFinal) return

      this.gameModel.prepareCurrentAnswers()

      this.mainView.showAnswers(this.gameModel.getCurrentAnswers())
      this.mainView.setTimer(this.gameModel.getAnswerTime())
    },

    processAnswer (item) {
      console.log('>>>process answer', item.text)

      this.gameModel.setAnswerById(item.id)
      this.mainView.clearTimer()
      this.mainView.clearAnswers()
      this.mainView.clearBgndImage()

      this.playAmbient()
      this.playMusic()

      this.mode = this.MODE_ANSWER
      this.playVideoAndAudio()
    },

    processVideoEnded (name) {
      console.log('video ended:', name)
      this.gameModel.setNextVideo()
      if (!this.playVideoSequence()) {
        this.processVideoAndAudioEnding()
      }
    },

    processAudioEnded (name) {
      console.log('audio ended:', name)
      this.gameModel.setNextAudio()
      if (!this.playAudioSequence()) {
        this.processVideoAndAudioEnding()
      }
    },

    playVideoAndAudio () {
      let hasVideoEmpty = this.gameModel.hasVideoEmpty()
      let hasAudioEmpty = this.gameModel.hasAudioEmpty()

      if (hasVideoEmpty && hasAudioEmpty) {
        this.processVideoAndAudioEnding()
        return
      }

      if (!hasVideoEmpty) {
        this.playVideoSequence()
      }
      if (!hasAudioEmpty) {
        this.playAudioSequence()
      }
    },

    playVideoSequence () {
      if (!this.gameModel.hasCurrentVideo() && this.mode === this.MODE_AFTER_QUESTION) {
        this.gameModel.setCurrentVideoIndex(0)
      }

      if (this.gameModel.hasCurrentVideo()) {
        this.mainView.playVideo(this.gameModel.getCurrentVideoName(), false)
        return true
      }
      return false
    },

    playAudioSequence () {
      if (!this.gameModel.hasCurrentAudio() && this.mode === this.MODE_AFTER_QUESTION) {
        this.gameModel.setCurrentAudioIndex(0)
      }

      if (this.gameModel.hasCurrentAudio()) {
        this.mainView.playAudio(this.gameModel.getCurrentAudioName(), false)
        return true
      }
      return false
    },

    processVideoAndAudioEnding () {
      let hasVideoPlaying = this.gameModel.hasCurrentVideo()
      let hasAudioPlaying = this.gameModel.hasCurrentAudio()
      let hasVideoEmpty = this.gameModel.hasVideoEmpty()
      let hasAudioEmpty = this.gameModel.hasAudioEmpty()

      console.log(this.mode, hasVideoPlaying, hasAudioPlaying, hasVideoEmpty, hasAudioEmpty)

      if (this.mode === this.MODE_QUESTION) {
        if (
          (hasVideoEmpty && hasAudioEmpty) ||
          (hasVideoEmpty && !hasAudioPlaying) ||
          (hasAudioEmpty && !hasVideoPlaying) ||
          (hasVideoPlaying && !hasAudioPlaying) ||
          (!hasVideoPlaying && !hasAudioPlaying)
        ) {
          console.log('case1')

          this.mainView.stopVideo()
          this.mainView.stopAudio()

          this.showCurrentAnswers()
          if (!this.gameModel.isFinal) {
            this.showAfterQuestion()
          }
          return
        }
      }

      if (this.mode === this.MODE_AFTER_QUESTION) {
        if (!hasVideoPlaying && !hasAudioPlaying) {
          if (this.gameModel.hasEmptyAnswer()) {
            console.log('case2')
            this.processAnswer(this.gameModel.getCurrentAnswers()[0])
            return
          }
        }
      }

      if (this.mode === this.MODE_ANSWER) {
        if (
          (hasVideoEmpty && hasAudioEmpty) ||
          (hasVideoEmpty && !hasAudioPlaying) ||
          (hasAudioEmpty && !hasVideoPlaying) ||
          (!hasVideoPlaying && !hasAudioPlaying)
        ) {
          console.log('case3')
          this.mainView.stopVideo()
          this.mainView.stopAudio()
          this.gameModel.setNextQuestion()
          this.showCurrentQuestion()
        }
      }
    },

    showBgndImage () {
      if (!this.gameModel.currentBgndImage) return
      this.mainView.showBgndImage(this.gameModel.currentBgndImage)
    },

    playAmbient () {
      let name = this.gameModel.getCurrentAmbientName()
      this.mainView.playAmbient(name)
    },

    playMusic () {
      let name = this.gameModel.getCurrentMusicName()
      this.mainView.playMusic(name)
    },

    processTimeExpired () {
      console.log('Time expired!')
      this.gameModel.processTimeExpired()
      this.showCurrentQuestion()
    },

    /* CHEATS */
    cheatSkip () {
      if (this.mode === this.MODE_QUESTION) {
        this.mainView.stopVideo()
        this.mainView.stopAudio()
        this.showCurrentAnswers()
        if (!this.gameModel.isFinal) {
          this.showAfterQuestion()
        }
      }
      if (this.mode === this.MODE_ANSWER) {
        this.mainView.stopVideo()
        this.mainView.stopAudio()
        this.gameModel.setNextQuestion()
        this.showCurrentQuestion()
      }
    },

    cheatBack () {
      this.mainView.stopVideo()
      this.mainView.stopAudio()
      this.mainView.clearTimer()
      this.gameModel.setPrevQuestion()
      this.showCurrentQuestion()
    },

    cheatEpisode () {
      this.mainView.stopVideo()
      this.mainView.stopAudio()
      this.mainView.clearTimer()
      this.gameModel.setEpisode()
      this.showCurrentQuestion()
    }

  }
}
</script>
