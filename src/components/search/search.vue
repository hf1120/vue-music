<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>

    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll ref="shortcut" :data="shortcut" class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(key.k)" class="item" v-for="key in hotKey">
                <span>{{key.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>

    <div class="search-result" v-show="query" ref="searchResult">
      <suggest @select="saveSearch" @listScroll="blurInput" class="suggest" :query="query" ref="suggest"></suggest>
    </div>

    <confirm
      text="确认清空所有搜索历史？"
      confirmBtnText="清空"
      @confirm="deleteSearchHistory(false)"
      @cancel=""
      ref="confirm">
      
    </confirm>

    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from 'base/search-box/search'
  import {getHotKey} from 'api/search'
  import Suggest from 'components/suggest/suggest'
  import {playlistMixin} from 'common/js/mixin'
  import { mapActions, mapGetters } from 'vuex'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'

  export default {
    data() {
      return {
        hotKey: [],
        query: ''
      }
    },

    components: {
      SearchBox,
      Suggest,
      SearchList,
      Scroll,
      Confirm
    },

    created() {
      this._getHotKey();
    },

    computed: {
      shortcut() {
        return this.hotKey.concat(this.searchHistory);
      },
      ...mapGetters([
        'searchHistory'
      ])
    },

    methods: {
      _getHotKey() {
        getHotKey().then(res => {
          if (res.code === 0) {
            this.hotKey = res.data.hotkey.slice(1, 11);
          }
        }).catch(err => {
          console.log('err');
          console.log(err);
        })
      },

      addQuery(query) {
        this.$refs.searchBox.setQuery(query);
      },

      onQueryChange(query) {
        this.query = query;
        this.$refs.suggest._searchKey();
      },

      handlePlaylist(playlist) {
        const bottom = playlist.length ? '60px' : "";
        this.$refs.searchResult.style.bottom = bottom;
        this.$refs.shortcutWrapper.style.bottom = bottom;

        this.$refs.shortcut.refresh();
        this.$refs.suggest.refresh();
      },

      blurInput() {
//        this.$refs.searchBox.$refs.searchInput.blur();
        this.$refs.searchBox.blur();
      },

      saveSearch() {
        if(this.query !== "") this.saveSearchHistory(this.query);
      },

      showConfirm() {
        this.$refs.confirm.show();
      },

      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory'
      ])

    },

    watch: {
      query(newQuery) {
        if(!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh();
          }, 20)
        }
      }
    },

    mixins: [playlistMixin]
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search {
    .search-box-wrapper {
      margin: 20px;
    }

    .shortcut-wrapper {
      position: fixed;
      top: 178px;
      bottom: 0;
      width: 100%;

      .shortcut {
        height: 100%;
        overflow: hidden;

        .hot-key {
          margin: 0 20px 20px 20px;
          .title {
            margin-bottom: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }

          .item {
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: $color-highlight-background;
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }

        .search-history {
          position: relative;
          margin: 0 20px;

          .title {
            display: flex;
            align-items: center;
            height: 40px;
            font-size: $font-size-medium;
            color: $color-text-l;

            .text {
              flex: 1;
            }

            .clear {
              extend-click();
              .icon-clear {
                font-size: $font-size-medium;
                color: $color-text-d;
              }
            }
          }
        }


      }
    }

    .search-result {
      position: fixed;
      width: 100%;
      top: 178px;
      bottom: 0;
    }
  }
</style>
