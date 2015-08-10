const onRender = require('./on-render')(),
      onWindowScroll = require('./event-batch')(window, 'scroll', onRender),
      topFixer = require('./top-fixer'),
      currentNav = require('./current-nav');

window.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementsByTagName('nav')[0];
  onWindowScroll(currentNav(nav));
});
