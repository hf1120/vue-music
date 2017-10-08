import Vue from 'vue'
import Router from 'vue-router'
import Rank from 'components/rank/rank'
import Recommend from 'components/recommend/recommend'
import Search from 'components/search/search'
import Singer from 'components/singer/singer'
import SingerDetail from 'components/singer-detail/singer-detail'
import Dist from 'components/disc/disc'
import topList from 'components/top-list/top-list'
Vue.use(Router);
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'recommend'
    },

    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: topList
        }
      ]
    },

    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Dist
        }
      ]
    },

    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path      : ':id',
          component : SingerDetail
        }
      ]
    },

    {
      path: '/search',
      component: Search
    },

    {
      path: '*',
      component: Recommend
    }
  ]
})
