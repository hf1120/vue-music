import * as types from './mutation-types'
import {playMode} from "../common/js/config"
import {shuffle} from "../common/js/utils"

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list);

  if(state.mode === playMode.random) {
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

export const addSong = function ({commit, state}, song) {
  let list = state.sequenceList.slice(0);
  list.push(song);
  commit(types.SET_SEQUENCE_LIST, list);


  let index = list.length - 1;

  if(state.mode === playMode.random) {
    let randomList = shuffle(list);
    commit(types.SET_PLAY_LIST, randomList);
    index = findIndex(randomList, song);
  } else {
    commit(types.SET_PLAY_LIST, list);
  }

  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};
