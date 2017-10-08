<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <Slider :loadAImage="loadAImage"></Slider>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(list)" class="item" v-for="list in discList">
              <div class="icon">
                <img width="60px" class="needsclick" height="60px" v-lazy="list.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="list.creator.name"></h2>
                <p class="desc" v-html="list.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading :replyFuc="_getDescList"></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'

  import { getDescList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import { playlistMixin } from 'common/js/mixin'
  import * as types from 'store/mutation-types'
  import { mapMutations } from 'vuex'

  export default {
    components: {
      Slider,
      Scroll,
      Loading
    },

    data() {
      return {
        recommends : [],
        discList   : [],
      }
    },

    mixins: [playlistMixin],

    created() {
      setTimeout(()=>{
        this._getDescList();
      },20)
    },

    methods: {
      handlePlaylist(playlist) {
        this.$refs.recommend.style.bottom = playlist.length > 0 ? '50px' : '';
        this.$refs.scroll.refresh();
      },

      _getDescList() {
        getDescList()
          .then((res)=>{
          if(res.code === ERR_OK){
            this.discList = res.data.list;
          }
        })
          .catch(err=>{
          console.log('err');
          console.log(err);
        })
      },

      loadAImage() {
        this.$refs.scroll.refresh();
      },

      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        });
        this.setDisc(item);
      },

      ...mapMutations({
        setDisc: types.SET_DISC
      })
    },


  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;

    .recommend-content {
      height: 100%;
      overflow: hidden;

      .slider-wrapper{
        position: relative;
        width: 100%;
        overflow: hidden;
      }
      .recommend-list{
        .list-title{
          height: 65px;
          line-height: 65px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-theme;
        }

        .item{
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 20px;

          .icon{
            flex: 0 0 60px;
            widht: 60px;
            padding-right: 20px;
          }

          .text{
            display: flex;
            flex-direction column
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: $font-size-medium;

            .name{
              margin-bottom: 10px;
              color: $color-text;
            }
            .desc{
              color: $color-text-d;
            }
          }
        }
      }

      .loading-container{
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%)
      }
    }
  }
</style>
