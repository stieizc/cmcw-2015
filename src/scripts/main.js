const onRender = require('./on-render')();
const onScroll = require('./event-batch')(window, 'scroll', onRender);
const topFixer = require('./top-fixer');

window.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementsByTagName('nav')[0];
  const links = nav.childNodes;

  onScroll(topFixer(nav));
  
  var i = links.length;
  while(i--) {
    const a = links[i];
    const target = document.getElementById(
      a.getAttribute('href').slice(1));
    a.addEventListener('click', (e) => {
      console.log(e);
    });
  }
});
