<template>
  <scroll
    class="listview"
    :data="data"
    ref="listview"
    :listenScroll=true
    :probeType="3"
    @scroll="scroll"
  >
    <ul>
      <li class="singer-group" v-for="singers in data" ref="listGroup">
        <h3 class="singer-title">{{singers.title}}</h3>
        <ul>
          <li class="singer-group-list" v-for="singer in singers.items">
            <img class="singer-avatar" v-lazy="singer.avatar">
            <span class="singer-name">{{singer.name}}</span>
          </li>
        </ul>
      </li>
    </ul>

    <ul v-show="data.length" class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <li
        :class="(classCom(item) ? 'current ' : '') + (!item.isTrue ? 'notrue ' : '') "
        v-for="(item, index) in shortcutList"
        :data-index="theIndex(item.title,item.isTrue, true)"
        :data-theIndex="index"
        ref="ListNum"
      >
        {{item.title}}
      </li>
    </ul>


    <div class="last-sing" ref="lastSing" v-show="fixedTitle">
      <div class="fixedTitle">
        {{fixedTitle}}
      </div>
    </div>


  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'

  import {ABCDESTR} from 'common/js/resources'
  import {getAttrs} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18;
  const FIXED_TITLE_HEIGHT  = 30;

  export default {
    data() {
      return {
        curIndex : 0,
        scrollY  : -1,
        IndexAry : [],
        diff     : - 1
      }
    },

    created() {
      this.Index = -1;
      this.touch = {};
      this.listHeight = [];
      this.fixedTop = 0;
    },

    mounted() {
      setTimeout(() => {
        this.comIndex();
      }, 20)
    },

    computed: {
      shortcutList() {
        //将存在的提取出来
        let list = this.data.map(group => {
          return group.title.substr(0, 1);
        });

        let str = list.join('');

        //判断是否存在
        let ary = [];
        for (let key in ABCDESTR) {
          if (str.indexOf(key) > -1) {
            ABCDESTR[key].isTrue = true;
          }
          ary.push(ABCDESTR[key]);
        }

        //排序
        ary.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });

        //将末尾的热门拿出来放到头部
        ary.unshift(ary.pop());

        return ary;
      },

      fixedTitle() {
        if(this.scrollY > 0){
          return ''
        }
//        let diff = this.listHeight[this.curIndex + 1] + this.scrollY;
//        if(diff < 30){
//          this.$refs.lastSing.style.top = diff - 30 + 'px';
//        } else if(diff) {
//          this.$refs.lastSing.style.top = 0;
//        }
        return this.data[this.curIndex] ? this.data[this.curIndex].title : ''
      }
    },

    components: {
      Scroll,
    },

    props: {
      data: {
        type: Array,
        default: []
      }
    },

    methods: {
      onShortcutTouchStart(e) {
        let cur = e.target;
        let anchorIndex = getAttrs(cur, 'index');
        anchorIndex > -1 && this.elementTo(this.$refs.listGroup[anchorIndex]);
        ///
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;

        //获取真实索引
        this.touch.theIndex = getAttrs(cur, 'theIndex');
        this.curIndex = this.touch.theIndex;

      },

      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;

        // 判断移动了多少个入口
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;

        // 得到落点入口索引
        let anchorIndex = this.touch.theIndex + delta;
        if (anchorIndex < 0) anchorIndex = 0;
        if (anchorIndex > 26) anchorIndex = 26;

        // 判断此落点是否有效
        let cur = this.$refs.ListNum[anchorIndex];
        let Index = getAttrs(cur, 'index');

        if (Index > -1) {
          this.curIndex = anchorIndex;
          this.elementTo(this.$refs.listGroup[Index]);
        }
      },

      scroll(pos) {
        this.scrollY = pos.y;
      },

      classCom(item) {
        let curIndex = this.theIndex(item.title, item.isTrue, false);
        return this.curIndex + 1 === curIndex + 1;
      },

      comIndex() {
        this.listHeight = [];
        const listGroup = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);
        if(listGroup){
          for (let i = 0; i < listGroup.length; i++) {
            height += listGroup[i].clientHeight;
            this.listHeight.push(height)
          }
        }

      },

      elementTo(ele) {
        this.$refs.listview.scrollToElement(ele, 0);
      },

      theIndex(title, isTrue, flag) {
        if (flag) {
          if (title === '热') {
            this.Index = -1;
            this.IndexAry = [];
            this.com = 1;
          }

          if (isTrue) {
            this.Index++;
            if (this.Index > 100) return -1;
            return this.Index;
          }
          return -1;
        }
        if (!isTrue) return -1;
        if(this.Index >= 22) this.Index = -1;
        return this.Index + 1;
      }
    },

    watch: {
      data() {
        setTimeout(() => {
          this.comIndex();
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight;

        if(newY > 0){
          this.curIndex = 0;
          return;
        }

        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];

          if( -newY >= height1 && -newY < height2) {
            this.curIndex = i;
            this.diff = height2 + newY;
            return;
          }
        }

        this.curIndex = listHeight.length - 2;
      },
      diff(newVal) {
        let fixedTop = newVal > 0 && newVal < FIXED_TITLE_HEIGHT ? newVal - FIXED_TITLE_HEIGHT : 0;
        if(this.fixedTop === fixedTop){
          return
        }
        this.fixedTop = fixedTop;
        this.$refs.lastSing.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background

    .singer-group {
      padding-bottom: 20px;
      .singer-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
      .singer-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .singer-group-list {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;

        .singer-name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }

    .list-shortcut {
      position: absolute;
      top: 50%;
      right: 0;
      width: 20px;
      transform: translateY(-50%)
      background: $color-background-d;
      border-radius: 10px;
      font-family: Helvetica;
      text-align: center;
      li {
        color: $color-text-l;
        padding: 3px;
        font-size: $font-size-small;
      }

      li.notrue {
        color: #616161
      }

      li.current {
        color: $color-theme
      }

    }
    .last-sing {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixedTitle {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
    }

  }

</style>
