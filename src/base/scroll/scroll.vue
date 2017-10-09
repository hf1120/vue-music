<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },

      click: {
        type: Boolean,
        default: true
      },

      data: {
        type: Array,
        default: null
      },

      listenScroll: {
        type: Boolean,
        default: false
      },

      pullUp: {
        type: Boolean,
        default: false
      }

    },

    mounted() {
      this.$nextTick(() => {
        this._initScroll();
      });
    },

    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
//          alert('初始化失败！请刷新页面');
          console.log('scroll 组件初始化失败了');
          return;
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
        });

        if (this.listenScroll) {
          let that = this;
          this.scroll.on('scroll', pos => {
            that.$emit('scroll', pos)
          })
        }

        if (this.pullUp) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd');
            }
          })
        }
      },

      enable() {
        this.scroll && this.scroll.enabled();
      },

      disable() {
        this.scroll && this.scroll.disable();
      },

      refresh() {
        this.scroll && this.scroll.refresh();
      },

      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },

      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      }

    },

    watch: {
      data() {
        setTimeout(() => {
          this.refresh();
        }, 20)
      }
    }
  }
</script>

<style>

</style>
