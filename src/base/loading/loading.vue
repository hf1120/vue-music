<template>
  <div class="loading">
    <img width="24px" height="24px" src="./loading.gif" alt="">
    <p class="desc">{{theTitle}}</p>
    <span @click="retry" class="retry" v-show="retryIng">重试</span>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        retryIng: false
      }
    },
    props: {
      title: {
        type: String,
        default: '正在加载..'
      },
      replyFuc: {
        type: Function,
        default: null
      }
    },

    mounted() {
      if(this.replyFuc) this.loaded();
    },

    methods: {
      loadFail() {
        this.oldTitle = this.title;
        this.retryIng = true;
      },
      retry() {
        this.retryIng = false;
        this.replyFuc();
      },
      loaded() {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.loadFail();
          this.loaded();
        },5000)
      }
    },

    computed: {
      theTitle() {
        if(this.retryIng) {
          return '网络可能卡住，点击尝试重新加载';
        }
        return this.title;
      }
    },

    beforeDestroy(){
      clearTimeout(this.timer);
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .loading{
    width:100%;
    text-align: center;
    .desc{
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
    }

    .retry{
      color: #00ffe8;
    }
  }
</style>
