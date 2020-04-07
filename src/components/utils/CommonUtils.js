export default {
  getTagValueLABEL (content) {
    return this.getTagValue(content, 'LABEL')
  },

  getTagValueANSWERSORDER (content) {
    return this.getTagValue(content, 'ANSWERSORDER')
  },

  getTagValueANSWERTIME (content) {
    return this.getTagValue(content, 'ANSWERTIME')
  },

  getTagValueTIMEEXPIRED (content) {
    return this.getTagValue(content, 'TIMEEXPIRED')
  },

  getTagValueFINAL (content) {
    return this.getTagValue(content, 'FINAL')
  },

  getTagValueGOTO (content) {
    return this.getTagValueSequence(content, 'GOTO')
  },

  getTagValueNAVIGATEURL (content) {
    return this.getTagValue(content, 'NAVIGATEURL')
  },
  getTagValueVIDEO (content) {
    return this.getTagValueVideoSequence(content, 'VIDEO')
  },

  getTagValueAUDIO (content) {
    return this.getTagValueAudioSequence(content, 'AUDIO')
  },

  getTagValueBGNDVIDEO (content) {
    return this.getTagValueVideoSequence(content, 'BGNDVIDEO')
  },

  getTagValueBGNDAUDIO (content) {
    return this.getTagValueVideoSequence(content, 'BGNDAUDIO')
  },

  getTagValueBGNDIMAGE (content) {
    return this.getTagValueSequence(content, 'BGNDIMAGE')
  },

  getTagValueAMBIENT (content) {
    return this.getTagValue(content, 'AMBIENT').replace('.mp3', '')
  },

  getTagValueMUSIC (content) {
    return this.getTagValue(content, 'MUSIC').replace('.mp3', '')
  },

  getTagValueVideoSequence (content, tagName) {
    const sequence = this.getTagValueSequence(content, tagName)
    const result = sequence.map(item => item.trim().replace('.mp4', '').replace('.flv', ''))
    return result
  },

  getTagValueAudioSequence (content, tagName) {
    const sequence = this.getTagValueSequence(content, tagName)
    const result = sequence.map(item => item.trim().replace('.mp3', ''))
    return result
  },

  getTagValueSequence (content, tagName) {
    let images = this.getTagValue(content, tagName)
    if (images === '') {
      return []
    }
    let result = images.split(',')
    return result
  },

  getTagValue (content, tagName) {
    let result = ''
    // console.log(content)
    let tmp = content.split('[' + tagName)
    if (tmp[1]) {
      tmp = tmp[1].split(']')
      result = tmp[0].trim()
    }
    return result
  },

  getArrayRandomElement (arr) {
    if (arr && arr.length) {
      return arr[Math.floor(Math.random() * arr.length)]
    }
    // The undefined will be returned if the empty array was passed
  },

  /**
   * Shuffles array in place. ES6 version
   * @param {Array} a items An array containing the items.
   */
  shuffle (a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
}
