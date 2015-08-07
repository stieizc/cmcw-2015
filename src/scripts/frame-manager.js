const raf = require('raf');

function FrameManager() {
  /*
   * Accept bottom halves that will do rendering, and call them on next frame.
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

  function pending() {
    return BFs.length > 0;
  }

  function add(BF) {
    BFs.push(BF);
  }

  function flush() {
    if (BFs.length > 0) raf(cb);
  }

  function cb(t) {
    var i = BFs.length;
    while(i--) BFs[i](t);
    BFs = [];
  }

  return {pending, add, flush};
}

module.exports = FrameManager;
