const utils = require('./utils');

function currentNav(nav) {
  const links = nav.childNodes;
  const posYs = [];
  var top = 0;

  var i = links.length;
  while(i--) {
    posYs[i] = (utils.posY(document.getElementById(
      links[i].getAttribute('href').slice(1))));
  }

  function TF() {
    var i = posYs.length,
        pageY = window.pageYOffset;
    while(i--) {
      if (utils.isOverTop(posYs[i], pageY)) break;
    }
    if (i === -1) i = 0;
    if (top !== i) return changeCurrent(i);
  }

  function changeCurrent(i) {
    return () => {
      if (top > i) window.scroll(0, posYs[i]); // Help the user to scroll up
      links[top].classList.remove('current');
      links[i].classList.add('current');
      top = i;
    };
  }

  return TF;
}

module.exports = currentNav;
