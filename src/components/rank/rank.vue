<template>
  <div class="rank" ref="rank">
    <scroll :data="lists" :replyFuc="_getTopList" class="toplist" ref="toplist">
      <ul>
        <li class="item" v-for="list in lists" @click="selectItem(list)">
          <div class="icon">
            <img width="100" height="100" v-lazy="list.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(item, i) in list.songList">
              <span>{{i + 1}}</span>
              <span>{{item.songname}}-{{item.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="loading-container" v-show="!lists.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getTopList} from 'api/rank'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  import { mapMutations } from 'vuex'
  import * as types from 'store/mutation-types'

  export default {
    mixins: [playlistMixin],

    data() {
      return {
        lists: []
      }
    },

    created() {
      this._getTopList();
    },

    methods: {
      _getTopList() {
        getTopList().then(res => {
          if (res.code === 0) {
            this.lists = res.data.topList;
          }

        }).catch(err => {
          console.log('err');
        })
      },

      handlePlaylist(playlist) {
        const bottom = playlist.length ? '60px' : '';
        this.$refs.rank.style.bottom = bottom;
        this.$refs.toplist.refresh();
      },

      selectItem(item) {
        this.$router.push(`rank/${item.id}`);
        this.setTopList(item)
      },

      ...mapMutations({
        'setTopList': types.SET_TOP_LIST
      })
    },

    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .toplist {
      height: 100%;
      overflow: hidden;
      .item {
        display: flex;
        margin: 0 20px;
        padding-top: 20px;
        height: 100px;
        &:last-child {
          padding-bottom: 20px;
        }
        .icon {
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
        }
        .songlist {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          height: 100px;
          overflow: hidden;
          background: $color-highlight-background;
          color: $color-text-d;
          font-size: $font-size-small;
          .song {
            no-wrap();
            line-height: 26px;
          }
        }
      }
    }

    .loading-container {
      height: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
