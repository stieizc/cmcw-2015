const onRender = require('./on-render')(),
      onWindowScroll = require('./event-batch')(window, 'scroll', onRender),
      topFixer = require('./top-fixer'),
      currentNav = require('./current-nav'),
      setToggleMap = require('./map');

window.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementsByTagName('nav')[0],
        mapButton = document.getElementById('venue').getElementsByTagName('button')[0],
        mapWrapper = document.getElementById('map');
  onWindowScroll(topFixer(nav));
  onWindowScroll(currentNav(nav));
  setToggleMap(mapButton, mapWrapper);
});
