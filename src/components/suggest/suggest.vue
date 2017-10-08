<template>
  <scroll :data="result" class="suggest" ref="suggest">
    <ul class="suggest-list">

      <li @click="play(item)" class="suggest-item" v-for="item in result">

        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>

        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>

      </li>

    </ul>

    <div class="loading-container" v-show="!result.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
  const TYPE_SINGER = 'singer';
  import {searchKey} from 'api/search';
  import {createSong} from 'common/js/song'
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import * as types from 'store/mutation-types'

  export default {
    data() {
      return {
        curPage: 1,
        result: []
      }
    },

    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },

    watch: {
      query() {
        this._searchKey();
      }
    },

    components: {
      Loading,
      Scroll
    },

    computed: {
      ...mapGetters([
        'playlist'
      ])
    },

    methods: {
      _searchKey() {
        this.result = [];
        if (this.query) {
          searchKey(
            this.query,
            this.page,
            this.showSinger
          ).then((res) => {
            if (res.code === 0) {
              this.result = this._getResult(res.data);
            }
          }).catch(err => {
            if(err.message.toLocaleLowerCase() === 'timeout') {
              this._searchKey();
            }
          })
        }
      },

      _getResult(data) {
        let ret = [];
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }

        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list));
        }
        return ret;
      },

      _normalizeSongs(list) {
        let ret= [];
        list.forEach(musicData => {
          if(musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      },

      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        }
        return 'icon-music'
      },

      getDisplayName(item) {
        if(item.type === TYPE_SINGER) {
          return item.singername;
        }
        return `${item.name} - ${item.singer}`
      },

      refresh() {
        this.$refs.suggest.refresh();
      },

      play(item) {
        if(this.playlist && this.playlist.length) {
          this.addSong(item);
        } else {
          this.selectPlay({
            list: [item],
            index: 0
          });
        }
      },

      ...mapMutations({
        "setPlayList": types.SET_PLAY_LIST,
        "setCurrentIndex": types.SET_CURRENT_INDEX
      }),

      ...mapActions([
        'selectPlay',
        'addSong'
      ])

    },

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest {
    height: 100%;
    overflow: hidden;

    .suggest-list {
      padding: 0 30px;

      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20 px;
      }

      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }

      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;

        .text {
          no-wrap();
        }
      }
    }

    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transfrom: translateY(-50%);
    }

    .loading-container {
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
