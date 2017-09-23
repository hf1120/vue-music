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
        <span>{{fullScreen}}</span>

        <div class="top">
          <i @click="back" class="icon-back"></i>
          <div class="songTitle" v-html="currentSong.name"></div>
          <p class="album" v-html="currentSong.singer"></p>
        </div>

        <div class="center">
          <div class="center-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
          <div class="center-r"></div>
        </div>

        <div class="bom">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i @click="play" :class="playIcon"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next"></i>
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
          <img width="40" height="40" :src="currentSong.image">
        </div>

        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>

        <div class="control">

        </div>

        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <video class="audio" ref="audio" :src="currentSong.url"></video>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import * as Types from 'store/mutation-types'
  import animations from 'create-keyframe-animation'

  export default {
    data() {
      return {
        newPlaying: false
      }
    },
    computed: {
      playIcon() {
        return this.playing ? "icon-pause" : "icon-play";
      },

      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing'
      ]),

    },

    watch: {
      currentSong() {
        this.$nextTick(() => {
          this.$refs.audio.play();
        })
      },

      playing(newVal) {
        const audio = this.$refs.audio;
        this.$nextTick(() => {
//          this.newPlaying ? audio.play() : audio.pause()
        })
      },

    },

    methods: {
      back() {
//        this.$refs.big.style.display = 'none';
        this.setFullScreen(false);
      },

      open() {
        this.setFullScreen(true);
      },

      play() {
        this.setPlaying(!this.playing);
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

      },

      afterLeave() {

      },

      _getPosAndScale() {
        const targetWidth = 40;
//        const paddingLeft = 40;
        const paddingLeft = 30;
        const paddingBottom = 30;
        const paddingTop = 80;
        const width = window.innerWidth * 0.8;
        const scale = targetWidth / width;
        const x = -(window.innerWidth / 2 - paddingLeft);
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
        return {x, y, scale};
      },

      ...mapMutations({
        'setFullScreen': Types.SET_FULL_SCREEN,
        'setPlaying': Types.SET_PLAYING_STATE
      })

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
          display: inline-block;
          transform: rotate(-90deg);
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
        }

        .songTitle {
          width: 80%;
          display: inline-block;
          text-align: center;
          line-height: 39px;
        }

        .album {
          text-align: center
        }

      }

      .center {
        width: 100%;
        position: fixed;
        top: 80px;
        bottom: 170px;
        /*white-space: nowrap;*/
        font-size: 0;

        .center-l {
          width: 100%;
          height: 0;
          padding-top: 80%;
          position: relative

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
      }

      .bom {
        position: absolute;
        bottom: 50px;
        width: 100%;

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
        transition: all 0.4s
        .top, .bom {
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        }
      }

      &.normal-enter, &.normal-leave-to {
        opacity: 0
        .top {transform: translate3d(0, -100px, 0)}
        .bom {transform: translate3d(0, 100px, 0)}
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
  }
</style>
