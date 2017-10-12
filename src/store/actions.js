import * as types from './mutation-types'
import {playMode} from "../common/js/config"
import {shuffle} from "../common/js/utils"
import { setHistory, removeHistory } from '../common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list);

  if (state.mode === playMode.random) {
    let randomList = shuffle(list);
    commit(types.SET_PLAY_LIST, randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAY_LIST, list);
  }

  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAY_LIST, shuffle(list));
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_PLAY_MODE, playMode.random);
};

export const insertSong = function ({commit, state}, song) {
  // 获取歌曲当前的各项数据
  let playlist     = state.playList.slice(0);
  let sequenceList = state.sequenceList.slice(0);
  let currentIndex = state.currentIndex;

  // 查找目标歌曲是否已经存在歌单中
  let theIndex = findIndex(playlist, song);

  if (theIndex < 0) {
    if(currentIndex > -1) {
      // 如果不存在则添加到当前歌曲的后面
      playlist.splice(currentIndex, 0, song);

      // 将歌曲添加进歌曲列表
      sequenceList.push(song);
    } else {
      // 如果 currentIndex 为 -1 ，表示当前列表不存在，则添加新歌曲
      if (currentIndex === -1) {
        playlist.push(song);
        sequenceList.push(song);
        currentIndex = 0;
      }
    }

    // 设置歌曲的新索引、新播放列表、新歌曲列表
    commit(types.SET_PLAY_LIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
  }

  else if (currentIndex === theIndex) {
    // 如果已存在，并且目标歌曲是当前歌曲，就只弹出播放页面，并将播放状态设置为播放
  }

  else {
    // 如果已存在则播放该歌曲，不对列表做任何的改变
    commit(types.SET_CURRENT_INDEX, theIndex);
  }

  // 弹出播放页面
  commit(types.SET_FULL_SCREEN, true);

  // 将播放状态设置为播放
  commit(types.SET_PLAYING_STATE, true);
};

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, setHistory(query));
};

export const deleteSearchHistory = function ({commit} ,query) {
  commit(types.SET_SEARCH_HISTORY, removeHistory(query))
};
