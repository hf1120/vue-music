<template>
  <transition name="slide">
    <music-list :replyFuc="_getTopListSong" :rank="rank" :title="title" :songs="songs" :bgImage="bgImage" class="top-list">TopList</music-list>
  </transition>
</template>

<script>
  import musicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getTopListSong} from 'api/rank'
  import {createSong} from 'common/js/song'

  export default {
    data() {
      return {
        songs: [],
        rank: true
      }
    },

    components: {
      musicList,
    },

    computed: {
      ...mapGetters([
        'topList'
      ]),

      title() {
        return this.topList.topTitle;
      },

      bgImage() {
        if(this.songs.length) {
          return this.songs[0].image;
        }
        return '';
      }
    },

    created() {
      this._getTopListSong();
    },

    methods: {
      _getTopListSong() {
        if(!this.topList.id) {
          this.$router.push('/rank');
          return;
        }
        getTopListSong(this.topList.id).then(res => {
          this.songs = this._normalizeSongs(res.songlist);
        }).catch(err => {
          console.log('err');
        })
      },

      _normalizeSongs(list) {
        let ret = [];
        list.forEach(item => {
          let musicData = item.data;
          if(musicData.songid && musicData.albumid) ret.push(createSong(musicData));
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

  .top-list {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /*background: #007aff;*/
    z-index: 20;
  }
</style>
