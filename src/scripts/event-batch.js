function Batch(element, event, onRender, alwaysTF=false) {
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

  batch.remove = (TF) => {
    var i = TFs.length;
    while(i--) {
      if (TFs[i] === TF) {
        TFs.splice(i, 1);
        break;
      }
    }
  };

  batch.unmount = () => {
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
        while(i--) TFs[i](e);
      }
      return;
    }
    i = TFs.length;
    while(i--) {
      BF = TFs[i](e);
      if (BF) onRender(BF);
    }
    onRender.flush();
  }

  element.addEventListener(event, cb);

  return batch;
}

module.exports = Batch;
