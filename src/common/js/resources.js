export const ABCDESTR = (function () {
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  str.unshift('热');
  let cur = {};
  for (let i = 0; i < str.length; i++) {
    cur[str[i]] = {
      title: str[i],
      isTrue : false
    }
  }
  return cur;
})();
