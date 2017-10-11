<template>
  <div class="search-box">

    <i class="icon-search"></i>
    <input class="box" @keydown="InputMouseEnter" v-model="query" :placeholder="placeholder" ref="searchInput">
    <i @click="clear" v-show="query" class="icon-dismiss"></i>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        query: '',
        keyChange: false
      }
    },

    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },

    methods: {
      clear() {
        this.query = '';
        this.$emit('query', "");
      },

      setQuery(query) {
        this.query = query;
        this.$emit('query', this.query);
      },

      InputMouseEnter(e) {
        if(e.keyCode === 13 && this.keyChange && this.query) {
          this.keyChange = false;
          this.$emit('query', this.query);
        }
      },

      blur() {
        this.$refs.searchInput.blur();
      }
    },

    created() {
      this.$watch('query', (newQuery) => {
        if(!this.keyChange) this.keyChange = true;
//        this.$emit('query', newQuery);
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: $color-highlight-background;
    border-radius: 6px;

    .icon-search {
      font-size: 24px;
      color: $color-background
    }

    .box{
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      padding: 0 5px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;

      &::placeholder {
        color: $color-text-d;
      }
    }

    .icon-dismiss {
      font-size: 16px;
      color: $color-background;
    }
  }

</style>
