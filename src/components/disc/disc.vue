<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs" :replyFuc="_getDiscSongs"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'

  import { getDiscSongs } from 'api/recommend'

  import { createSong } from 'common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },

    components: {
      MusicList
    },

    computed: {
      title() {
        return this.disc.dissname
      },

      bgImage() {
        return this.disc.imgurl
      },

      ...mapGetters([
        'disc'
      ])
    },

    methods: {
      _getDiscSongs() {
        if(!this.disc.dissid) {
          this.$router.push('/recommend');
          return
        }
        getDiscSongs(this.disc.dissid).then(res=>{
          this.songs = this._normalizeSongs(res.cdlist[0].songlist);
        }).catch(err=>{
          console.log('err');
        })
      },

      _normalizeSongs(list) {
        let ret = [];
        list.forEach((musicData) => {
          if(musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      },
    },

    created() {
      this._getDiscSongs();
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

</style>
