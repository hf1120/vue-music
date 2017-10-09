import {commonParams, options} from 'api/config'
import jsonp from 'common/js/jsonp'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';

  const data = Object.assign({}, commonParams, {
    uin: 0,
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  });

  return jsonp(url, data, options)
}

export function searchKey(w, p, z, perPage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';

  const data = Object.assign({}, commonParams, {
    w,
    p,
    catZhida: z ? 1 : 0,
    perpage: perPage ? perPage : 20,
    uin: 0,
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    n: 20,
    remoteplace: "txt.mqq.all",
    _: +new Date()
  });

  return jsonp(url, data, {
    param: 'jsonpCallback',
    timeout: 2000
  })
}
