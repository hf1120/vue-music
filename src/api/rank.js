import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';

  const data = Object.assign({}, commonParams, {
    uin: 0,
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    _: +new Date(),
  });

  return jsonp(url, data, options)
}

export function getTopListSong(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
  const data = Object.assign({}, commonParams, {
    uin: 0,
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    _: +new Date(),
    topid
  });

  return jsonp(url, data, options)
}

  // g_tk: 5381,
  // inCharset: 'utf-8',
  // outCharset: 'utf-8',
  // notice: 0,
  // format: 'jsonp'
