<template>
  <div class="music-list">
    <div class="back">
      <i @click="back" class="icon-back"></i>
    </div>

    <div class="music-list-title">
      <h1 class="title">{{title}}</h1>
    </div>

    <div class="bg-image" :style="bg" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>

      <div class="filter"></div>
    </div>

    <div class="bg-layer" ref="bgLayer"></div>

    <scroll
      @scroll="scroll"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      :data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading">
        <loading v-show="!songs.length" :replyFuc="replyFuc"></loading>
      </div>
    </scroll>


    <!--不保留这一段，UC浏览器下会出现歌手列表显示不正常的问题-->
    <span class="test1">{{songs.length}}</span>

  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  import { mapActions } from 'vuex'

  const RESERVED_HEIGHT = 50;

  export default {
    data() {
      return {
        scrollY: -1
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    },

    props: {
      bgImage: {
        type: String,
        default: ''
      },

      songs: {
        type: Array,
        default: []
      },

      title: {
        type: String,
        default: ''
      },

      replyFuc: {
        type: Function,
        default: ''
      }
    },

    computed: {
      bg() {
        return `background-image:url(${this.bgImage})`
      }
    },

    created() {
      this.probeType = 3;
      this.listenScroll = true;
    },

    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight;
      this.minTranslateY = -this.imageHeight + this.imageHeight / 1.5 | 0;
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },

    methods: {
      back() {
        this.$router.back();
      },

      scroll(pos) {
        this.scrollY = pos.y;
      },

      selectItem(song,i) {
        this.selectPlay({
          list: this.songs,
          index: i
        })
      },

      ...mapActions([
        'selectPlay'
      ])
    },

    watch: {
      scrollY(newY) {
        if (this.MinScrollY <= this.minTranslateY && newY < this.minTranslateY) {
          return;
        }

        this.MinScrollY = Math.max(this.minTranslateY, newY);

        const percent = Math.abs(newY / this.imageHeight);
        let zIndex = 0;
        let scale = 1;
        let blur = 0;
        if (newY > 0) {
          blur = 0;
          zIndex = 20;
          scale = 1 + percent
        } else {
          blur = 5 * percent
        }

        this.$refs.bgLayer.style.transform = `translate3d(0,${this.MinScrollY}px,0)`;
        this.$refs.bgLayer.style.webketTransform = `translate3d(0,${this.MinScrollY}px,0)`;
        this.$refs.bgImage.style.filter = `blur(${blur}px)`;

        //判断是否已经达到可上移的最高标准
        if (this.MinScrollY <= this.minTranslateY) {
          if (!this.flagScroll) {
            zIndex = 20;
            this.$refs.bgImage.style.paddingTop = '0';
            this.$refs.bgImage.style.height = this.imageHeight / 1.5 + 'px';
            this.flagScroll = true;
            this.$refs.playBtn.style.display = 'none'
          }
        } else {
          //如果flagScroll为真，表示已经为设置过此选项
          if (this.flagScroll) {
            this.$refs.bgImage.style.paddingTop = '70%';
            this.$refs.bgImage.style.height = 0;
            this.flagScroll = false;
            this.$refs.playBtn.style.display = 'block'
          }
        }

        this.$refs.bgImage.style.zIndex = zIndex;
        this.$refs.bgImage.style.transform = `scale(${scale})`;
        this.$refs.bgImage.style.webkitTransform = `scale(${scale})`;

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .music-list {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $color-background;
    z-index: 20;
    .back {
      position absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }

    .music-list-title {
      width: 100%;
      position: absolute;
      top: 0;
      height: 39px;
      background: rgba(0, 0, 0, .1);
      z-index: 30;

      .title {
        position: absolute;
        top: 0;
        left: 10%;
        width: 80%;
        z-index: 30;
        no-wrap();
        text-align: center;
        line-height: 39px;
        font-size: $font-size-large;
        color: $color-text;
      }
    }

    .bg-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
      .filter {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(7, 17, 27, 0.3)
        .play {
          width: 50px;
          height: 20px;
          background: #007aff;
          position: absolute;
          bottom: 20px;
        }
      }
      .play-wrapper {
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play {
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play {
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          }

          .text {
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
          }

        }
      }

    }

    .list {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      z-index: 15;
      background: $color-background;
      .song-list-wrapper {
      }
      .loading {
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .bg-layer {
      position: relative
      height: 100%
      background: $color-background
    }
  }

  .test1 {
    height: 0;
  }
</style>
