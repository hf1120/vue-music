var express = require('express');
var app = express();
var axios = require('axios');

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});


var apiRoutes = express.Router();

apiRoutes.get('/getDiscList',function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  axios.get(url,{
    headers: {
      referer: 'https://c.y.qq.com/,' ,
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log('error');
    console.log(e);
  })
});

apiRoutes.get('/lyric',function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
  axios.get(url,{
    headers: {
      referer: 'https://c.y.qq.com/,' ,
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data;
    var reg = /^\w+\(({[^()]+})\)$/;
    if(typeof ret === 'string') {
      var matches = ret.match(reg);
      if(matches) {
        ret = JSON.parse(matches[1]);
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e);
  })
});

apiRoutes.get('/getDiscSongs',function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
  axios.get(url,{
    headers: {
      referer: 'https://c.y.qq.com/,' ,
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log('error');
    console.log(e);
  })
});


app.use('/api',apiRoutes);

app.listen(3000,function () {
  console.log('3000端口已启用');
});
