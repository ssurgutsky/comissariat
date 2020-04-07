<template>
  <div></div>
</template>

<script>

import commonUtils from '@/components/utils/CommonUtils.js'

import scenario from '@/assets/data/scenario.json'

export default {
  data: () => ({
    scenario,
    marksDictionary: {},
    sessions: 0,
    currentNode: null,
    prevQuestionNodes: null,
    nextNode: null,
    currentQuestionLabel: '',
    isFinal: false,
    currentAnswers: null,
    answerTime: 0,
    timeExpiredMark: '',
    currentVideoSequence: [],
    currentVideoIndex: 0,
    currentAudioSequence: [],
    currentAudioIndex: 0,
    currentBgndImage: null,
    currentAmbientName: '',
    currentMusicName: '',
    navigateUrl: '',
    episodeNo: 1
  }),
  mounted () {
    // console.log(this.scenario)
    this.prepareData()
  },
  methods: {
    prepareData () {
      this.createMarksDictionary(scenario)
      // console.log(this.marksDictionary)

      let test = this.findNodeWithMark(scenario, 'Mark_Final8')
      console.log('TEST', test)
    },

    restartGame () {
      this.currentNode = scenario.node[0].node[0]
      if (this.sessions > 0) {
        let startNode = this.findNodeWithMark(scenario, 'GAME_SAVEPOINT')
        if (startNode) {
          this.currentNode = startNode
        }
      }
      this.sessions++
      this.prevQuestionNodes = []
      this.answerTime = 0
      this.timeExpiredMark = ''
      this.episodeNo = 1
    },

    createMarksDictionary (node) {
      if (node._mark) {
        let marks = node._mark.split(',')
        for (let m in marks) {
          this.marksDictionary[marks[m].trim()] = node
        }
      }
      for (let i in node.node) {
        this.createMarksDictionary(node.node[i])
      }
    },

    findNodeWithMark (node, markName) {
      let trimmedMarkName = markName.trim()
      let result = this.marksDictionary[trimmedMarkName]
      return result
    },

    processGOTONode (node) {
      let result = node
      let markNames = commonUtils.getTagValueGOTO(result._content)

      while (markNames.length > 0) {
        let markName = commonUtils.getArrayRandomElement(markNames)
        result = this.findNodeWithMark(scenario, markName)
        if (!result) {
          console.log('Cant find mark in scenario!', markName)
          return node
        }
        markNames = commonUtils.getTagValueGOTO(result._content)
      }
      return result
    },

    prepareCurrentQuestion () {
      this.prevQuestionNodes.push(this.currentNode)
      this.currentNode = this.processGOTONode(this.currentNode)

      this.currentQuestionLabel = commonUtils.getTagValueFINAL(this.currentNode._content)
      this.isFinal = this.currentQuestionLabel !== ''
      if (!this.isFinal) {
        this.currentQuestionLabel = commonUtils.getTagValueLABEL(this.currentNode._content)
      }

      this.navigateUrl = commonUtils.getTagValueNAVIGATEURL(this.currentNode._content)

      const bgndImages = commonUtils.getTagValueBGNDIMAGE(this.currentNode._content)
      this.currentBgndImage = commonUtils.getArrayRandomElement(bgndImages)

      this.currentVideoSequence = commonUtils.getTagValueVIDEO(this.currentNode._content)
      this.currentVideoIndex = 0
      this.currentAudioSequence = commonUtils.getTagValueAUDIO(this.currentNode._content)
      this.currentAudioIndex = 0

      this.currentAmbientName = commonUtils.getTagValueAMBIENT(this.currentNode._content)
      this.currentMusicName = commonUtils.getTagValueMUSIC(this.currentNode._content)
    },

    hasEmptyQuestion () {
      return (this.currentNode._content === '')
    },

    prepareAfterQuestion () {
      this.currentVideoSequence = commonUtils.getTagValueBGNDVIDEO(this.currentNode._content)
      this.currentVideoIndex = 0
      this.currentAudioSequence = commonUtils.getTagValueBGNDAUDIO(this.currentNode._content)
      this.currentAudioIndex = 0
    },

    getCurrentQuestionLabel () {
      return this.currentQuestionLabel
    },

    getCurrentNavigateUrl () {
      return this.navigateUrl
    },

    getCurrentVideoName () {
      let result = this.currentVideoSequence[this.currentVideoIndex]
      return result
    },

    getCurrentAudioName () {
      let result = this.currentAudioSequence[this.currentAudioIndex]
      return result
    },

    getCurrentAmbientName () {
      return this.currentAmbientName
    },

    getCurrentMusicName () {
      return this.currentMusicName
    },

    setNextVideo () {
      this.currentVideoIndex++
    },

    setNextAudio () {
      this.currentAudioIndex++
    },

    setCurrentVideoIndex (value) {
      this.currentVideoIndex = value
    },

    setCurrentAudioIndex (value) {
      this.currentAudioIndex = value
    },

    hasCurrentVideo () {
      return this.currentVideoSequence.length > this.currentVideoIndex
    },

    hasCurrentAudio () {
      return this.currentAudioSequence.length > this.currentAudioIndex
    },

    hasVideoEmpty () {
      return this.currentVideoSequence.length === 0
    },

    hasAudioEmpty () {
      return this.currentAudioSequence.length === 0
    },

    prepareCurrentAnswers () {
      this.currentAnswers = []
      for (let i in this.currentNode.node) {
        let gotoNode = this.processGOTONode(this.currentNode.node[i])
        let text = commonUtils.getTagValueLABEL(gotoNode._content)
        this.currentAnswers.push({id: i, text: text, node: gotoNode, nextNode: gotoNode.node})
      }

      let answersOrder = commonUtils.getTagValueANSWERSORDER(this.currentNode._content)
      if (answersOrder.toUpperCase() !== 'OFF' && !this.$debug) {
        commonUtils.shuffle(this.currentAnswers)
      }

      this.answerTime = commonUtils.getTagValueANSWERTIME(this.currentNode._content)
      this.timeExpiredMark = commonUtils.getTagValueTIMEEXPIRED(this.currentNode._content)
    },

    hasEmptyAnswer () {
      const result = (this.currentAnswers.length === 1 && this.currentAnswers[0].text === '')
      return result
    },

    getCurrentAnswers () {
      return this.currentAnswers
    },

    getAnswerTime () {
      return this.answerTime || 0
    },

    setAnswerById (id) {
      const item = this.currentAnswers.filter(item => {
        return item.id === id
      })
      this.currentNode = item[0].node
      this.currentVideoSequence = commonUtils.getTagValueVIDEO(this.currentNode._content)
      this.currentVideoIndex = 0
      this.currentAudioSequence = commonUtils.getTagValueAUDIO(this.currentNode._content)
      this.currentAudioIndex = 0
      this.nextNode = this.currentNode.node[0]
      this.currentAmbientName = commonUtils.getTagValueAMBIENT(this.currentNode._content)
      this.currentMusicName = commonUtils.getTagValueMUSIC(this.currentNode._content)
    },

    setNextQuestion () {
      this.currentNode = this.nextNode
    },

    setPrevQuestion () {
      console.log(this.prevQuestionNodes)
      this.currentNode = this.prevQuestionNodes.pop()
      if (this.prevQuestionNodes.length) {
        this.currentNode = this.prevQuestionNodes.pop()
      }
    },

    setEpisode () {
      console.log('setEpisode', this.episodeNo)
      const episodeNode = this.findNodeWithMark(scenario, 'EPISODE' + this.episodeNo)
      if (episodeNode) {
        this.currentNode = episodeNode
        this.episodeNo++
      } else {
        this.episodeNo = 1
        this.setEpisode()
      }
    },

    processTimeExpired () {
      if (this.timeExpiredMark !== '') {
        let gotoNode = this.findNodeWithMark(scenario, this.timeExpiredMark)
        if (gotoNode) {
          this.currentNode = gotoNode
        }
      }
    }
  }
}
</script>
