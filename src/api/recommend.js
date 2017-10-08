import jsonp from 'common/js/jsonp'
import * as config from './config'
import axios from 'axios'


export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  const data = Object.assign({}, config.commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return jsonp(url, data, config.options);
}

export function getDescList() {
  const url = config.URL + '/api/getDiscList';

  const data = Object.assign({}, config.commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json',
    loginUin: 0
  });

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  })
}

export function getDiscSongs(disstid) {
  const url = config.URL + '/api/getDiscSongs';
  const data = Object.assign({}, config.commonParams, {
    type: 1,
    json: 1,
    uft8: 1,
    onlysong: 0,
    disstid,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  });
  return axios.get(url,{
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  })
}

// export function getDiscSongs(disstid) {
//   const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
//
//   const data = Object.assign({}, config.commonParams, {
//     type: 1,
//     json: 1,
//     uft8: 1,
//     onlysong: 0,
//     disstid,
//     loginUin: 0,
//     hostUin: 0,
//     notice: 0,
//     platform: 'yqq',
//     needNewCode: 0
//   });
//
//   return jsonp(url, data, config.options);
// }


// g_tk: 5381,
// inCharset: 'utf-8',
// outCharset: 'utf-8',
// notice: 0,
// format: 'jsonp'
