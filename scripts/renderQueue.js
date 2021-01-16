// source: http://bl.ocks.org/syntagmatic/3341641
var renderQueue = (function(func) {
  let _queue = [];
  let _rate = config.initRenderRate;
  let _valid = true;

  let rq = function(data) {
    if (data) rq.data(data);
    _valid = false;
    rq.render();
  };

  rq.render = function() {
    _valid = true;
    function doFrame() {
      if (!_valid) return true;
      if (0 === _queue.length) {
        _valid = false;
        return true;
      }
      let chunk = _queue.splice(0,_rate);
      chunk.map(func);
      _rate < config.maxRenderRate  && ++_rate;
      timer_frame(doFrame);
    }

    doFrame();
  };

  rq.data = function(data) {
    _valid = false;
    _queue = data;
    return rq;
  };

  let timer_frame = (callback) => setTimeout(callback, config.delayMillisecs);

  return rq;
});