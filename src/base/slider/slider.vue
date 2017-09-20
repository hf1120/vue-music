<template>
  <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
    <!-- slides -->
    <swiper-slide v-for="recommend in recommends" :key="recommend.id">
      <a class="needsclick" :href="recommend.linkUrl">
        <img @load="changeHeight" :src="recommend.picUrl">
      </a>
    </swiper-slide>

    <div class="swiper-pagination" slot="pagination"></div>
    <!--<div class="swiper-button-prev" slot="button-prev"></div>-->
    <!--<div class="swiper-button-next" slot="button-next"></div>-->
    <!--<div class="swiper-scrollbar"   slot="scrollbar"></div>-->
  </swiper>

</template>

<script>
  import './swiper-3.4.2.min.css'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {getRecommend} from 'api/recommend'
  import {ERR_OK} from 'api/config'

  export default {
    components: {
      swiper,
      swiperSlide
    },

    data() {
      return {
        recommends: [],
        notNextTick: true,
        // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
        swiperOption: {
          // swiper optionss 所有的配置同swiper官方api配置
          loop: true,
          autoplay: 3000,
          grabCursor: true,
          setWrapperSize: true,
          autoHeight: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          autoplayDisableOnInteraction: false,
//          prevButton:'.swiper-button-prev',
//          nextButton:'.swiper-button-next',
//          scrollbar:'.swiper-scrollbar',
          mousewheelControl: true,
          observeParents: true,

          // swiper的各种回调函数也可以出现在这个对象中，和swiper官方一样
//          onTransitionStart(swiper){
//            console.log(swiper)
//          },
        },
        isLoaded: false
      }
    },

    created() {
      this._getRecommend();
    },

    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },

    //mounted() {this.swiper.slideTo(3, 1000, false)},

    props: {
      loadAImage: Function
    },

    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider;
          }
        })
      },

      changeHeight() {
        if (!this.isLoaded) {
          this.loadAImage();
          this.isLoaded = true;
        }
      }

    }
  }
</script>

<style scoped>
  img {
    width: 100%;
  }
</style>
