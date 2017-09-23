export const getAttrs = function (el, name, val) {
  name = 'data-' + name;
  if(val){
    return el.setAttribute(name, val);
  } else {
    return Number(el.getAttribute(name));
  }
}

let elementStyle = document.createElement('div').style;

let vendor = (() => {
  let transformNames = {
    webkit   : 'webkitTransform',
    Moz      : 'MozTransform',
    O        : 'OTransform',
    ms       : 'msTransform',
    standard : 'transform'
  };

  for(let key in transformNames) {
    if(elementStyle[transformNames[key]] !== undefined){
      return key;
    }
  }

  return false;
})();

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
