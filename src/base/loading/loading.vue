<template>
  <div class="loading">
    <img width="24px" height="24px" src="./loading.gif" alt="">
    <p class="desc">{{title}}</p>
    <span @click="retry" class="retry" v-show="retryIng">重试</span>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        oldTitle: '',
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
      this.timer = setTimeout(() => {
        this.loadFail();
      },5000)
    },

    methods: {
      loadFail() {
        this.oldTitle = this.title;
        this.title = '网络可能卡住，您可以点击尝试重新加载';
        this.retryIng = true;
      },
      retry() {
        this.retryIng = false;
        this.title = this.oldTitle || '正在尝试重新加载...';
        this.replyFuc();
      }
    },

    destoryed(){
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
