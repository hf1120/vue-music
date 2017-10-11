<template>

  <scroll @beforeScroll="listScroll"
          :pullUp="true"
          :beforeScroll="true"
          :data="result"
          class="suggest"
          ref="suggest"
          @scrollToEnd="searchMore">
    <ul class="suggest-list">

      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">

        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>

        <div class="name">
          <p class="text"  v-html="getDisplayName(item)"></p>
        </div>

      </li>

      <loading v-show="hasMore" title="加载更多啊"></loading>
    </ul>

    <div class="no-result-wrapper">
      <no-result v-show="noResult" title="没有找到您搜索的歌曲或歌手"></no-result>
    </div>

    <div class="loading-container" v-show="!result.length && !noResult">
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
  import Singer from 'common/js/singer'
  import NoResult from 'base/no-result/no-result'


  import * as types from 'store/mutation-types'

  const perPage = 20;

  export default {
    data() {
      return {
        result: [],
        hasMore: false,
        page: 1,
        noResult: false
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
      Scroll,
      NoResult
    },

    computed: {
      ...mapGetters([
        'playlist'
      ])
    },

    methods: {
      _searchKey() {
        this.page = 1;
        this.result = [];
        this.hasMore = false;
        this.noResult = false;
        if (this.query) {
          searchKey(
            this.query,
            this.page,
            this.showSinger,
            perPage
          ).then((res) => {
            // 当拿到的数据没有内容时，要提示用户
            if(res.data.song.list.length === 0) this.noResult = true;
            console.log(res);

            if (res.code === 0) {
              this.result = this._getResult(res.data);
              this._checkMore(res.data);
            }
          }).catch(err => {
            if (err.message.toLocaleLowerCase() === 'timeout') {
              this._searchKey();
            }
          })
        }
      },

      searchMore() {
        if (!this.hasMore) return;
        this.page++;

        searchKey(this.query, this.page, this.showSinger, perPage).then(res => {
          if (res.code === 0) {
            this.result = this.result.concat(this._getResult(res.data));
            this._checkMore(res.data);
          }
        }).catch(err => {
          this.page--;
          this.searchMore();
        })
      },

      _checkMore(data) {
        const song = data.song;
        if(song) {
          this.hasMore = true;
        }
        if (!song.list.length || (song.curnum + song.curpage * perPage) >= song.totalnum) {
          this.hasMore = false;
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
        let ret = [];
        list.forEach(musicData => {
          if (musicData.songid && musicData.albumid) {
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
        if (item.type === TYPE_SINGER) {
          return item.singername;
        }
        return `${item.name} - ${item.singer}`
      },

      refresh() {
        this.$refs.suggest.refresh();
      },

      selectItem(item) {
        if(item.type === TYPE_SINGER) {
          const singer = new Singer({
            id   : item.singerid,
            mid  : item.singermid,
            name : item.singername
          });

          this.$router.push({
            path: `/search/${singer.id}`
          });

          this.setSinger(singer);

          return;
        }
        this.insertSong(item);
      },

      listScroll() {
        this.$emit('listScroll');
      },

      ...mapMutations({
        "setSinger": types.SET_SINGER,
      }),

      ...mapActions([
        'selectPlay',
        'insertSong'
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
        padding-bottom: 20px;
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
      transform: translateY(-50%);
    }

    .loading-container {
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

  }
</style>
