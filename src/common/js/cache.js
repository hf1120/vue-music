const SEARCH_HISTORY = '__search__';

const SEARCH_HISTORY_LENGTH = 15;

export const setHistory = function (query) {
  let history = getItem(SEARCH_HISTORY, []);
  insertArray(history, query, SEARCH_HISTORY_LENGTH);

  // 将最终处理过的 history 存储到本地
  setItem(history);
  return history;
};

export const removeHistory = function (query) {
  if (!query) {
    // 如果 query 不存在，则表示清空 History
    localStorage.removeItem(SEARCH_HISTORY);
    return [];
  }
  // 拿到本地数据
  let history = getItem(SEARCH_HISTORY, []);

  // 如果数据不存在直接终止函数
  if (!history) return [];

  // 首先要保证这个记录的有效性
  let index = findItem(history, query);

  // 只在索引有效的情况下进行操作
  if (index > -1) {
    history.splice(index, 1);
    setItem(history);
  }

  return history;
};

function setItem(data) {
  if (typeof data !== 'string') data = JSON.stringify(data);
  localStorage.setItem(SEARCH_HISTORY, data);
}

function getItem(name, _default) {
  const data = localStorage.getItem(name);
  if(data) {
    return JSON.parse(data);
  }
  return _default;
}

function findItem(ary, query) {
  for (let i = 0; i < ary.length; i++) {
    if (ary[i] === query) return i;
  }
  return -1;
}

function insertArray(ary, val, maxLen) {
  const index = findItem(ary, val);

  // 如果是数组中的第一项，则停止操作
  if (index === 0) return;

  // 如果数据已存在并且不在数组第一项，则删除该项
  if (index > 0) {
    ary.splice(index, 1);
  }

  ary.unshift(val);

  // 如果数组超出规定上限，则删掉末尾项
  if (maxLen && ary.length > maxLen) ary.pop();
}

export const getInitHistory = function () {
  return getItem(SEARCH_HISTORY, []);
}
