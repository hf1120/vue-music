<template>
  <transition name="slide">
    <music-list :replyFuc="_getSingerInfo" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getSingerInfo } from 'api/singer'
  import { createSong } from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        songs: []
      }
    },

    computed: {
      ...mapGetters([
        'singer'
      ]),
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      }
    },

    components: {
      MusicList,
    },

    created() {
      this._getSingerInfo();

    },

    methods: {
      _getSingerInfo() {
        if(!this.singer.id) {
          this.$router.push('/singer');
          return;
        }

        getSingerInfo(this.singer.id).then(res=>{
          this.songs = this._normalizeSongs(res.data.list);
        }).catch(err=>{
          console.log('err');
        })
      },

      _normalizeSongs(list) {
        let ret = [];
        list.forEach(item => {
          let { musicData } = item;
          if(musicData.songid && musicData.albummid) ret.push(createSong(musicData));
        });
        return ret;
      }
    }
  }
</script>

<style scoped>
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
