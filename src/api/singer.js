import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'


export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
  let data = Object.assign({}, commonParams,{
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0
  });

  return jsonp(url, data, options)
}


  // g_tk: 5381,
  // inCharset: 'utf-8',
  // outCharset: 'utf-8',
  // notice: 0,
  // format: 'jsonp'

export function getSingerInfo(singerid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
  let data = Object.assign({}, commonParams, {
    order: 'listen',
    begin: 0,
    num: 99,
    singerid,
    uin: 0,
    platform: 'h5page',
    needNewCode: 1,
    from: 'h5'
  });

  return jsonp(url, data, options)
}
