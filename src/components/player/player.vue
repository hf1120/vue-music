<template>
  <div class="player" v-show="playlist.length>0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="big" ref="big" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>

        <div class="top">
          <i @click="back" class="icon-back"></i>
          <div class="songTitle" v-html="currentSong.name"></div>
          <p class="album" v-html="currentSong.singer"></p>
        </div>

        <div
          class="center"
          @touchstart.prevent="centerTouchStart"
          @touchmove.prevent="centerTouchMove"
          @touchend="centerTouchEnd"
        >
          <div class="center-l" ref="centerL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{playingLyric}}
              </div>
            </div>
          </div>
          <scroll class="center-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  class="text"
                  :class="{'current': currentLineNum === i}"
                  ref="lyricLine"
                  v-for="(line, i) in currentLyric.lines"
                >{{line.txt}}</p>
              </div>
            </div>
            <p v-show="showLyricTip" class="tip">此歌曲为没有填词的纯音乐，请您欣赏</p>
          </scroll>
        </div>

        <div class="bom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :percent="percent"
                @progressChange="onProgressChange"
                :duration="currentSong.duration"
                @stopTime="stopTime"
                @currentTime="currentTimeChange"
              ></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>

          <div class="operators">
            <div class="icon i-left" @click="onModeChange">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="play" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="sm">
      <div class="sm" @click="open" v-show="!fullScreen">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdCls">
        </div>

        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>

        <div class="control">
          <i :class="smPlayIcon" @click.stop="play"></i>
        </div>

        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      class="audio"
      ref="audio"
      :src="currentSong.url"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import * as Types from 'store/mutation-types'
  import animations from 'create-keyframe-animation'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/utils'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'
  import {prefixStyle} from 'common/js/dom'

  const transform = prefixStyle('transform');
  const transitionDuration = prefixStyle('transitionDuration');

  export default {
    data() {
      return {
        songReady: false,
        currentTime: null,
        stopTimeState: false,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: '',
        LyricTip: '此歌曲为没有填词的纯音乐，请您欣赏',
        showLyricTip: false
      }
    },

    components: {
      ProgressBar,
      Scroll
    },

    computed: {
      playIcon() {
        return this.playing ? "icon-pause" : "icon-play";
      },

      smPlayIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },

      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },

      disableCls() {
        return this.songReady ? '' : 'disable'
      },

      percent() {
        return this.currentTime / this.currentSong.duration;
      },

      iconMode() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
      },

      ...mapGetters([
        'fullScreen',
        'playlist',
        'sequenceList',
        'currentSong',
        'currentIndex',
        'playing',
        'mode'
      ]),
    },

    watch: {
      currentSong(newSong, oldSong) {
        this.playingLyric = '';
        if (newSong.id === oldSong.id) return;
        if (this.currentLyric) this.currentLyric.stop();
        this.$nextTick(() => {
          this.$refs.audio.play();
          this.getLyric();
        })
      },

      playing(newState) {
        const audio = this.$refs.audio;
        this.$nextTick(() => {
          newState ? audio.play() : audio.pause();
        })
      }
    },

    methods: {
      back() {
        this.setFullScreen(false);
      },

      open() {
        this.setFullScreen(true);
      },

      play() {
        if (!this.songReady) return;
        this.setPlaying(!this.playing);
        if (this.currentLyric) this.currentLyric.togglePlay();
      },

      prev() {
        if (!this.songReady) return;
        if(this.playlist.length === 1) {
          this.loop();
        } else {
          let index = this.currentIndex - 1;
          if (index === -1) index = this.playlist.length - 1;
          this.setCurrentIndex(index);
          if (!this.playing) this.play();
          this.songReady = false;
        }

      },

      next() {
        if (!this.songReady) return;

        if(this.playlist.length === 1) {
          this.loop();
        } else {
          let index = this.currentIndex + 1;
          if (index >= this.playlist.length) index = 0;
          this.setCurrentIndex(index);
          if (!this.playing) this.play();
          this.songReady = false;
        }

      },

      loop() {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        if (this.currentLyric) this.currentLyric.seek(0);
      },

      end() {
        if (this.mode === playMode.loop) {
          this.loop();
        } else {
          this.next();
        }
      },

      ready() {
        this.songReady = true;
      },

      error() {
        this.songReady = true;
      },

      updateTime(e) {
        if (!this.stopTimeState) this.currentTime = e.target.currentTime;
      },

      format(interval) {
        let str = '';
        interval = interval | 0;
        let hours = interval / 3600 | 0;
        let minutes = interval / 60 | 0;
        let second = interval % 60;
        if (hours > 0) str = this._pad(hours) + ":";

        minutes = this._pad(minutes);
        second = this._pad(second);

        str += `${minutes}:${second}`;
        return str;
      },

      _pad(num, n = 2) {
        let len = num.toString().length;
        while (len < n) {
          num = '0' + num;
          len++
        }
        return num;
      },

      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale();

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },

          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },

          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        };

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 500,
            easing: 'linear'
          }
        });

        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
      },

      afterEnter() {
        animations.unregisterAnimation('move');
        this.$refs.cdWrapper.style.animation = '';
      },

      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.5s';
        const {x, y, scale} = this._getPosAndScale();
        this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
        this.$refs.cdWrapper.addEventListener('transitionend', done);
      },

      afterLeave() {
        this.$refs.cdWrapper.style.transtion = '';
        this.$refs.cdWrapper.style.transform = '';
      },

      _getPosAndScale() {
        const targetWidth = 40;
//        const paddingLeft = 40;
        const paddingLeft = 50;
        const paddingBottom = 30;
        const paddingTop = 80;
        const width = window.innerWidth * 0.8;
        const scale = targetWidth / width;
        const x = -(window.innerWidth / 2 - paddingLeft);
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
        return {x, y, scale};
      },

      onProgressChange(num) {
        const currentTime = num * this.currentSong.duration;
        this.$refs.audio.currentTime = currentTime;
        this.stopTimeState = false;
        if (this.currentLyric) this.currentLyric.seek(currentTime * 1000);

      },

      onModeChange() {
        const mode = (this.mode + 1) % 3;
        this.setPlayMode(mode);
        let list = null;
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList);
        } else {
          list = this.sequenceList;
        }
        this.resetCurrentIndex(list);
        this.setPlayList(list);
      },

      resetCurrentIndex(list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id;
        });
        this.setCurrentIndex(index);
      },

      stopTime() {
        this.stopTimeState = true;
      },

      currentTimeChange(num) {
        this.currentTime = num * this.currentSong.duration;
      },

      getLyric() {
        this.showLyricTip = false;
        this.currentSong.getLyric().then((lyric) => {
          if(lyric.indexOf('此歌曲为没有填词的纯音乐') > -1) {
            this.playingLyric = '此歌曲为没有填词的纯音乐，请您欣赏';
            this.LyricTip = this.playingLyric;
            this.showLyricTip = true;
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) this.currentLyric.play();
        }).catch(() => {
          this.currentLyric = null;
          this.playingLyric = '未获取到歌词';
          this.LyricTip = this.playingLyric;
          this.currentLineNum = 0;
          this.showLyricTip = true;
        })
      },

      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum;
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scrollToElement(lineEl, 1000);
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },

      centerTouchStart(e) {
        this.touch.inited = true;
        const touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
      },

      centerTouchMove(e) {
        if (!this.touch.inited) return;
        if (this.touch.move === false) return;

        const touch = e.touches[0];
        const deltaX = touch.pageX - this.touch.startX;
        const deltaY = touch.pageY - this.touch.startY;

        if (this.touch.move === null) {
          if (Math.abs(deltaX) < Math.abs(deltaY)) {
            this.touch.move = false;
            return;
          }
          this.touch.move = true;
        }

        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
        this.$refs.centerL.style.opacity = 1 - this.touch.percent;

        if (!this.touch.areStyle) {
          this.$refs.lyricList.$el.style[transitionDuration] = `0ms`;
          this.$refs.centerL.style[transitionDuration] = `0ms`;
          this.touch.areStyle = true;
        }

        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
      },

      centerTouchEnd() {
        this.touch.inited = false;

        if (!this.touch.percent || !this.touch.move) {
          this.touch.move = null;
          return;
        }

        let offsetWidth;
        let opacity;
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth;
            this.currentShow = 'lyric';
            opacity = 0;
          } else {
            opacity = 1;
            offsetWidth = 0;
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0;
            this.currentShow = 'cd';
            opacity = 1;
          } else {
            opacity = 0;
            offsetWidth = -window.innerWidth;
          }
        }
        const time = 300;
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;

        this.$refs.centerL.style.opacity = opacity;
        this.$refs.centerL.style[transitionDuration] = `${time}ms`;

        this.touch.areStyle = false;

        this.touch.percent = null;
        this.touch.move = null;
      },

      ...mapMutations({
        'setFullScreen': Types.SET_FULL_SCREEN,
        'setPlaying': Types.SET_PLAYING_STATE,
        'setCurrentIndex': Types.SET_CURRENT_INDEX,
        'setPlayMode': Types.SET_PLAY_MODE,
        'setPlayList': Types.SET_PLAY_LIST
      })

    },

    created() {
      this.touch = {
        move: null
      };
    }
  }
</script>


<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player {
    .big {
      background: $color-background;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.6;
        z-index: -1;
        filter: blur(20px);
      }

      .top {
        .icon-back {
          transform: rotate(-90deg);
          font-size: $font-size-large-x;
          color: $color-theme;
          position: absolute;
          left: 9px;
          top: 9px;
        }

        .songTitle {
          width: 70%;
          margin: 0 auto;
          text-align: center;
          line-height: 39px;
          vertical-align: top;
          font-size: $font-size-large;
          color: $color-text;
          no-wrap()
        }

        .album {
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
          line-height: 20px;
        }

      }

      .center {
        width: 100%;
        position: fixed;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;

        .center-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;

          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }

          }

          .cd-wrapper {
            width: 80%;
            top: 0;
            left: 10%;
            height: 100%;
            position: absolute;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1)
              box-sizing: border-box;

              &.play {
                animation: rotate 20s linear infinite
              }

              &.pause {
                animation-play-state: paused
              }

              .image {
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
              }

            }
          }

        }
        .center-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
          }
          .tip {
            width: 100%;
            text-align: center;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
          }
        }
      }

      .bom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center
          font-size: 0
          .dot {
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active {
              width: 20px
              border-radius: 5px
              background: $color-text-ll
            }
          }

        }

        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 83%;
          margin: 0 auto;
          padding: 10px 0;

          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 50px;
            line-height: 30px;
            width: 50px;

            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }

          .progress-bar-wrapper {
            flex: 1;
            margin: 0 auto;
          }
        }

        .operators {
          display: flex
          align-items: center
          .icon {
            flex: 1
            color: $color-theme；
            &.disable {
              color: $color-theme-d
            }
            i {
              font-size: 30px
            }
          }

          .i-left {
            text-align: right
          }

          .i-center {
            padding: 0 20px
            text-align: center

            i {
              font-size: 40px
            }
          }
          .i-right {
            text-align: left
          }

          .icon-favorite {
            color: $color-sub-theme
          }
        }

      }

      &.normal-enter-active, &.normal-leave-active {
        transition: all 0.5s
        .top, .bom {
          transition: all 0.5s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        }
      }

      &.normal-enter, &.normal-leave-to {
        opacity: 0
        .top {
          transform: translate3d(0, -100px, 0)
        }
        .bom {
          transform: translate3d(0, 100px, 0)
        }
      }
    }

    .sm {
      width: 100%;
      height: 60px;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      background: $color-highlight-background
      .icon {
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
        img {
          border-radius: 50%;
          &.play {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;

        .name {
          margin-bottom: 2px;
          no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }

        .desc {
          no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
      .control {
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist {
          font-size: 30px;
          color: $color-theme-d;
        }
        .icon-mini {
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
    .audio {
      display: none;
    }

    @keyframes rotate {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
</style>
