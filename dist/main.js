(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var now = require('performance-now')
  , global = typeof window === 'undefined' ? {} : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = global['request' + suffix]
  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]

for(var i = 0; i < vendors.length && !raf; i++) {
  raf = global[vendors[i] + 'Request' + suffix]
  caf = global[vendors[i] + 'Cancel' + suffix]
      || global[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(global, fn)
}
module.exports.cancel = function() {
  caf.apply(global, arguments)
}

},{"performance-now":2}],2:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.7.1
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

}).call(this,require('_process'))
},{"_process":9}],3:[function(require,module,exports){
'use strict';

var utils = require('./utils');

function currentNav(nav) {
  var links = nav.childNodes;
  var targets = [];
  var top = 0,
      i = links.length,
      pageY;
  while (i--) {
    targets[i] = document.getElementById(links[i].getAttribute('href').slice(1));
  }

  function TF() {
    var _pageY = window.pageYOffset,
        ret,
        posY;
    i = targets.length;
    while (i--) {
      posY = utils.posY(targets[i]);
      if (utils.isOverTop(posY, _pageY)) {
        if (i === -1) i = 0;
        if (top !== i) ret = changeCurrent;else if (pageY < _pageY) {
          // Need to check if user is scrolling down
          var lastChild = targets[i].lastChild;
          if (utils.isOverTop(utils.posY(lastChild) + lastChild.offsetHeight, _pageY) && ++i < targets.length) {
            ret = goDown;
          }
        }
        break;
      }
    }
    pageY = _pageY;
    if (ret) return ret;
  }

  function changeCurrent() {
    // top and i can be used to check that user is scrolling up
    if (top > i) goUp(); // Help the user to scroll up
    links[top].classList.remove('current');
    links[i].classList.add('current');
    top = i;
  }

  function goUp() {
    // Since BF is performed later, check again if we need to scroll
    var posY = utils.posY(targets[i]);
    if (window.pageYOffset > posY) window.scroll(0, posY);
  }

  function goDown() {
    // Since BF is performed later, check again if we need to scroll
    var posY = utils.posY(targets[i]);
    if (window.pageYOffset < posY) window.scroll(0, posY);
  }

  return TF;
}

module.exports = currentNav;

},{"./utils":8}],4:[function(require,module,exports){
"use strict";

function Batch(element, event, onRender) {
  var alwaysTF = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

  /*
   * A wrapper for event handlers on `event` of `element` that make use of requestAnimationFrame
   * managed by `onRender`.
   * To reading and writing properties in turns that would cause many unnecessary layouts
   * these properties need to be read in batch, then write in batch. 
   * Thus handlers are split into top halves and bottom havles. Top halves read these properties
   * (they could write properties that won't cause reflow)
   *
   * Properties that would cause layout can be found here:
   * http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html
   *
   * EventFrame is used for registering top halves for event on elment. When an event is triggered,
   * all TFs are called with the event object, and return BFs for calling in the next animation frame.
   * TFs will return nothing if there's nothing to do. These BFs are deferred to next render.
   *
   * BFs are never called when a previous rendering is still pending. For TFs, if `alwaysTF` is false
   * (default), TFs will also not be envoked with a pending render, which means that TFs cannot assume
   * that all previous `event`s are catched; else they are called whenever `event` * is fired, which
   * means that TFs cannot assume that all previously returned BFs are called. Which behaviours is
   * desired is dependent on the specific usage.
   * 
  */
  var TFs = [];

  function batch(TF) {
    TFs.push(TF);
  }

  batch.remove = function (TF) {
    var i = TFs.length;
    while (i--) {
      if (TFs[i] === TF) {
        TFs.splice(i, 1);
        break;
      }
    }
  };

  batch.unmount = function () {
    element.removeEventListener(event, cb);
  };

  // Maybe array allocation here should be avoided and clearing should be used
  // instead to reduce the burden on gc?
  function cb(e) {
    var i, BF;
    if (onRender.pending()) {
      if (alwaysTF) {
        // Avoid allocating memories
        i = TFs.length;
        while (i--) TFs[i](e);
      }
      return;
    }
    i = TFs.length;
    while (i--) {
      BF = TFs[i](e);
      if (BF) onRender(BF);
    }
    onRender.flush();
  }

  element.addEventListener(event, cb);

  return batch;
}

module.exports = Batch;

},{}],5:[function(require,module,exports){
'use strict';

var onRender = require('./on-render')(),
    onWindowScroll = require('./event-batch')(window, 'scroll', onRender),
    topFixer = require('./top-fixer'),
    currentNav = require('./current-nav');

window.addEventListener('DOMContentLoaded', function () {
  var nav = document.getElementsByTagName('nav')[0];
  onWindowScroll(topFixer(nav));
  onWindowScroll(currentNav(nav));
});

},{"./current-nav":3,"./event-batch":4,"./on-render":6,"./top-fixer":7}],6:[function(require,module,exports){
'use strict';

var raf = require('raf');

function OnRender() {
  /*
   * Batch bottom halves that will do rendering, and call them on next frame.
   *
   * BFs are cleared on each frame.
   * BFs are envoked with the timestamp passed to requestAnimationFrame's callback.
   * The return values of BFs are ignored.
   *
   * BFs are never called when a previous rendering is still pending.
   *
   * When a FrameManager is used by different users, some of them may starve
   * (can never register BFs) if they use the pending() check. Life is not fair.
   *
   */
  var BFs = [];

  function onRender(BF) {
    BFs.push(BF);
  }

  onRender.pending = function () {
    return BFs.length > 0;
  };

  onRender.flush = function () {
    if (BFs.length > 0) raf(cb);
  };

  function cb(t) {
    var i = BFs.length;
    while (i--) BFs[i](t);
    BFs = [];
  }

  return onRender;
}

module.exports = OnRender;

},{"raf":1}],7:[function(require,module,exports){
'use strict';

var utils = require('./utils');

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
    } else if (!onTop && utils.isOverTop(posY, window.pageYOffset)) {
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

},{"./utils":8}],8:[function(require,module,exports){
'use strict';

function posY(element) {
  var y = 0;
  while (!!element && element.tagName.toLowerCase() !== 'body') {
    y += element.offsetTop;
    element = element.offsetParent;
  }
  return y;
}

function isOverTop(posY, pageY) {
  return posY <= pageY;
}

module.exports = { posY: posY, isOverTop: isOverTop };

},{}],9:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[5]);
