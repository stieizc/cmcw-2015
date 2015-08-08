const onRender = require('./on-render')();
const onScroll = require('./event-batch')(window, 'scroll', onRender);
const topFixer = require('./top-fixer');

window.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementsByTagName('nav')[0];
  const lis = document.getElementsByTagName('ul')[0].childNodes;

  onScroll(topFixer(nav));
  
  var i = lis.length;
  while(i--) {
    const a = lis[i].childNodes[0];
    const target = document.getElementById(
      a.getAttribute('href').slice(1));
    a.addEventListener('click', (e) => {
      console.log(e);
    });
  }
});
