<template>
  <RecycleScroller :style="styleObject" class="scroller" :items="items" :item-size="40">
    <template v-slot="{ item }">
      <div class="item" :class="item.isActive ? 'active' : ''" @click="onAnswerClick(item)">{{ item.text }}</div>
    </template>
  </RecycleScroller>
</template>

<script>

export default {
  data () {
    return {
      items: [],
      styleObject: {
        'visibility': 'none',
        'overflow-y': 'scroll'
      },
      isBlocked: false
    }
  },
  methods: {
    setAnswers (items) {
      this.isBlocked = false
      this.items = items
      if (this.items.length) {
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].isActive = i === 0
        }
      }
    },

    onAnswerClick (item) {
      console.log('onAnswerClick')
      if (this.isBlocked) return

      this.isBlocked = true
      // if (this.items.length) {
      //   for (let i = 0; i < this.items.length; i++) {
      //     this.items[i].isActive = item.id === this.items[i].id
      //   }
      // }
      // setTimeout(this.dispatchAnswerClick, 1000, item)

      this.dispatchAnswerClick(item)
    },

    dispatchAnswerClick (item) {
      this.$emit('answerClick', item)
    },

    showAnswers () {
      this.styleObject.visibility = 'visible'
    },

    hideAnswers () {
      this.styleObject.visibility = 'hidden'
    }
  }
}
</script>

<style scoped>
  div {
    background-color: #ffffff;
    color: #000000;
  }
/*  .scroller {
    height: auto;
  }
/**/
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
  }

  .active {
    background: rgba(0, 0, 255, 0.1);
  }

</style>
