export const getAttrs = function (el, name, val) {
  name = 'data-' + name;
  if(val){
    return el.setAttribute(name, val);
  } else {
    return Number(el.getAttribute(name));
  }
};
