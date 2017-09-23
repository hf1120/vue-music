<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner"
         @touchstart.prevent="progressTouchStart"
         @touchmove.prevent="progressTouchMove"
         @touchend="progressTouchEnd"
    >
      <div class="progress" ref="progress"></div>

      <div class="progress-btn-wrapper" ref="progressBtn">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const progressBtnWidth = 16;
  import { prefixStyle } from 'common/js/dom'
  const transform = prefixStyle('transform');

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      },

      duration: {
        type: Number,
        default: 0
      }
    },

    created() {
      this.touch = {};
    },

    methods: {
      progressTouchStart(e) {
        this.touch.initState = true;
        this.touch.offsetLeft = parseFloat(this.$refs.progressBar.offsetLeft) + 8;
        this._progressMove(e);
        this.$emit('stopTime',false)
      },

      progressTouchMove(e) {
        if(!this.touch.initState) return;
        this._progressMove(e);
      },

      _progressMove(e) {
        let pageX = e.touches[0].pageX;
        let offsetWidth = pageX - this.touch.offsetLeft;
        if(offsetWidth < 0) offsetWidth = 0;
        let width = parseFloat(this.$refs.progressBar.clientWidth) - 16;
        if(offsetWidth > width) offsetWidth = width;
        this.$refs.progress.style.width = `${offsetWidth}px`;
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        let newPercent = parseFloat(this.$refs.progress.clientWidth) / (parseFloat(this.$refs.progressBar.clientWidth) - 16);

        this.$emit('currentTime', newPercent);
      },

      progressTouchEnd() {
        this.touch.initState = false;
        let newPercent = parseFloat(this.$refs.progress.clientWidth) / (parseFloat(this.$refs.progressBar.clientWidth) - 16);
        this.$emit('progressChange', newPercent);
      }
    },

    watch: {
      percent(newPercent) {
        if(newPercent > 0 && !this.touch.initState) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
          const offsetWidth = newPercent * barWidth;
          this.$refs.progress.style.width = `${offsetWidth}px`;
          this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar {
    height: 30px;

    .bar-inner {
      position: relative;
      top: 13px;
      height: 5px;
      background: rgba(0, 0, 0, .3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;

        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }

</style>
