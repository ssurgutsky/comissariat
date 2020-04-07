<template>
  <div>
    <button class="restart" @click="onRestartClick">RESTART</button>
    <button :style="styleObjectCheat" @click="onSkipClick">Skip</button>
    <button :style="styleObjectCheat" @click="onBackClick">Back</button>
    <button :style="styleObjectCheat" @click="onEpisodeClick">Epsd</button>
  </div>
</template>

<script>

export default {
  data () {
    return {
      styleObjectCheat: {
        display: this.$debug ? 'auto' : 'none'
      }
    }
  },
  methods: {
    onRestartClick () {
      console.log('RESTART')
      this.$emit('restartGame')
    },

    onBackClick () {
      console.log('cheatBack')
      this.$emit('cheatBack')
    },

    onSkipClick () {
      console.log('cheatSkip')
      this.$emit('cheatSkip')
    },

    onEpisodeClick () {
      console.log('cheatEpisode')
      this.$emit('cheatEpisode')
    }
  }
}
</script>

<style scoped>
  .restart {
    border-radius: 12px;
  }
</style>
