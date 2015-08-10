const utils = require('./utils');

function currentNav(nav) {
  const links = nav.childNodes;
  const targets = [];
  var top = 0,
      i = links.length,
      pageY;
  while(i--) {
    targets[i] = document.getElementById(
      links[i].getAttribute('href').slice(1));
  }

  function TF() {
    var _pageY = window.pageYOffset, ret, posY;
    i = targets.length;
    while(i--) {
      posY = utils.posY(targets[i]);
      if (utils.isOverTop(posY, _pageY)) {
        if (i === -1) i = 0;
        if (top !== i) ret = changeCurrent;
        /* Scroll helpers may cause flipping
        else if (pageY < _pageY) {
          // Need to check if user is scrolling down
          var lastChild = targets[i].lastChild;
          if (utils.isOverTop(utils.posY(lastChild) +
                              lastChild.offsetHeight, _pageY) &&
              ++i < targets.length) {
            ret = goDown; 
          }
        }
        */
        break; 
      }
    }
    pageY = _pageY;
    if (ret) return ret;
  }

  function changeCurrent() {
    // top and i can be used to check that user is scrolling up

    /* Scroll helpers may cause flipping
    // if (top > i) goUp(); // Help the user to scroll up
    */

    links[top].classList.remove('current');
    links[i].classList.add('current');
    top = i;
  }

  function goUp() {
    // Since BF is performed later, check again if we need to scroll
    var posY = utils.posY(targets[i]);
    if (window.pageYOffset > posY)
      window.scroll(0, posY);
  }

  function goDown() {
    // Since BF is performed later, check again if we need to scroll
    var posY = utils.posY(targets[i]);
    if (window.pageYOffset < posY)
      window.scroll(0, posY);
  }

  return TF;
}

module.exports = currentNav;
