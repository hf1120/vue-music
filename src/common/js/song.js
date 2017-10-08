import {getLyric as _getLyric} from "../../api/song"
import {Base64} from 'js-base64'
import {ERR_OK} from "../../api/config"



class Song {
  constructor({id, mid, singer, name, album, duration, image, url}){
    this.id       = id;
    this.mid      = mid;
    this.singer   = singer;
    this.album    = album;
    this.duration = duration;
    this.image    = image;
    this.url      = url;
    this.name     = name;
  }

  getLyric() {
    if(this.lyric) return Promise.resolve(this.lyric);

    return new Promise((resolve, reject) => {
      _getLyric(this.mid).then(res => {
        if(res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        } else {
          reject('没有找到歌词')
        }
      })
    })

  }
}

export function createSong(musicData) {

  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  });
}

export function filterSinger(singer) {
  if(!singer || typeof singer !== 'object') return;

  let ret = [];

  singer.forEach(item => {
    ret.push(item.name);
  });

  return ret.join('/');
}
