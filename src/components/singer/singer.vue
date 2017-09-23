<template>
   <div class="singer">
     <list-view @select="selectSinger" :data="singerList"></list-view>

     <div v-show="!singerList.length" class="loading-container">
       <loading :replyFuc="_getSingerList"></loading>
     </div>

     <router-view></router-view>
   </div>
</template>



<script>
  import { getSingerList } from 'api/singer'

  import Singer from 'common/js/singer'

  import ListView from 'base/listview/listview'
  import Loading from 'base/loading/loading'

  import { mapMutations } from 'vuex'

  const HOT_SINGER_LEN = 10;
  const HOT_NAME = '热门';

  export default {
    components: {
      ListView,
      Loading
    },
    data() {
      return {
        singerList: []
      }
    },
    mounted() {
      this._getSingerList();
    },

    methods: {
      _getSingerList(){
        getSingerList().then(res => {
          this.singerList = this._initData(res.data.list);
        })
      },

      _initData(list) {
        let map = {
          hot:{
            title: HOT_NAME,
            items: []
          }
        };
        list.forEach((item, index) => {
          //提取歌手信息
          let cur = new Singer(item.Fsinger_id, item.Fsinger_mid, item.Fsinger_name);

          //存放热门歌手
          if(index < HOT_SINGER_LEN){
            map.hot.items.push(cur);
          }

          //存储所有歌手数据
          let key = item.Findex;
          if(!map[key]){
            map[key] = {
              title: key,
              items: [cur]
            }
          }else{
            map[key].items.push(cur);
          }
        });

        //数据格式排序
        let hot = [];
        let sor = [];
        for(let k in map){
          if(k === 'hot'){
            hot.push(map[k]);
          }else if(k.match(/[a-zA-Z]/)){
            sor.push(map[k]);
          }
        }

        sor.sort((a, b)=>{
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });

        return hot.concat(sor);
      },

      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        });
        this.setSinger(singer);
      },

      ...mapMutations({
        setSinger: 'set_singer'
      })
    }
  }
</script>

<style scoped>
  .singer{
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
  .loading-container {
    position: absolute;
    top: 50%;
    transform: translateY(-50);
    width: 100%;
  }
</style>
