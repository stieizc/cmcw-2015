const mapURL = 'https://www.google.com/maps/d/embed?mid=zC1q8FnOVhaI.ksz-yBnQUbOk';

function setToggleMap(button, mapWrapper) {
  button.addEventListener('click', toggle(mapWrapper));
}

function toggle(mapWrapper) {
  var show = false;
  const iframe = mapWrapper.getElementsByTagName('iframe')[0],
        section = mapWrapper.parentNode;

  return () => {
    show = !show;
    if (show) {
      if (iframe.src !== mapURL) {
        iframe.src = mapURL;
      }
      mapWrapper.style.display = 'block';
    } else {
      mapWrapper.style.display = 'none';
    }
  };
}

module.exports = setToggleMap;
