const utils = require('./utils');

function topFixer(element) {
  // Returns a top half for onScroll
  // Dirty hack for smooth sticky positioning for nav in a div
  var upperNode = element.previousSibling ? element.previousSibling : element.parentNode;
  var onTop = false;

  function TF() {
    var posY = utils.posY(upperNode) + upperNode.offsetHeight;
    if (onTop && !utils.isOverTop(posY, window.pageYOffset)) {
      onTop = false;
      return release;
    }
    else if (!onTop && utils.isOverTop(posY, window.pageYOffset)) {
      onTop = true;
      return fix;
    }
  }

  function fix() {
    element.classList.add('fixed');
  }

  function release() {
    element.classList.remove('fixed');
  }

  return TF;
}

module.exports = topFixer;
