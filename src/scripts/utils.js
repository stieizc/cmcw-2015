function posY(element) {
  var y = 0;
  while(!!element && element.tagName.toLowerCase() !== 'body') {
    y += element.offsetTop;
    element = element.offsetParent;
  }
  return y;
}

function isOverTop(posY, pageY) {
  return posY <= pageY;
}

module.exports = {posY, isOverTop};
