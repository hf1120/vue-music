export const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
};

export const options = {
  param: 'jsonpCallback'
};

export const ERR_OK = 0;

export const URL = 'http://' + location.href.split('//')[1].split('/')[0].split(':')[0] + ':3000';
