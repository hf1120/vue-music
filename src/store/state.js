import { playMode } from "../common/js/config"
const state = {
  singer       : {},
  playing      : false,              // 是否正在播放
  fullScreen   : false,              // 全屏
  playList     : [],                 // 播放列表
  sequenceList : [],                 // 顺序列表
  mode         : playMode.sequence,  // 播放模式
  currentIndex : -1,                 // 当前索引
  disc         : {},                 // 当前歌单
  topList      : [],                 // 当前榜单
};

/*
* 当前索引
* 窗口状态
* 播放模式
* 播放状态
* 歌曲列表
* 喜欢歌曲
* */

export default state;
