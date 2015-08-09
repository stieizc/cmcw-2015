const onRender = require('./on-render')(),
      onScroll = require('./event-batch')(window, 'scroll', onRender),
      topFixer = require('./top-fixer'),
      currentNav = require('./current-nav');

window.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementsByTagName('nav')[0];
  onScroll(topFixer(nav));
  onScroll(currentNav(nav));
});
