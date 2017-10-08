import {commonParams, URL} from './config'
import axios from 'axios'

export function getLyric(mid) {
  const url = URL + '/api/lyric';

  const data = Object.assign({}, commonParams, {
    pcachetime: +new Date(),
    songmid: mid,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })

}

// g_tk: 5381,
// inCharset: 'utf-8',
// outCharset: 'utf-8',
// notice: 0,
// format: 'jsonp'
