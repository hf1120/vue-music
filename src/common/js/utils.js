let getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export function shuffle(ary) {
  let array = ary.slice(0);
  for (let i = array.length - 1; i >= 0; i--) {
    let j = getRandom(0, i);
    let temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
}
