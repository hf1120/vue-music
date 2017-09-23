<template>
  <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
    <swiper-slide v-for="recommend in recommends" :key="recommend.id">
      <a :href="recommend.linkUrl">
        <img @load="changeHeight" :src="recommend.picUrl">
      </a>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
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
        swiperOption: {
          loop: true,
          autoplay: 3000,
          grabCursor: true,
          setWrapperSize: true,
          autoHeight: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          autoplayDisableOnInteraction: false,

          mousewheelControl: true,
          observeParents: true,
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
