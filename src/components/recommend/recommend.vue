<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <Slider :loadAImage="loadAImage"></Slider>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="list in discList">
              <div class="icon">
                <img width="60px" height="60px" v-lazy="list.imgurl" alt="">
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
  </div>
</template>

<script>
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import { getDescList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
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

    created() {
      setTimeout(()=>{
        this._getDescList();
      },20)
    },

    methods: {
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
      }
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
