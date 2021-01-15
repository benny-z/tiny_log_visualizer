// source: http://bl.ocks.org/syntagmatic/3341641
var renderQueue = (function(func) {
  let _queue = [];               // data to be rendered
  let _rate = config.renderRate; // number of calls per frame
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
      let chunk = _queue.splice(0,_rate);
      if (0 === chunk.length) {
        _valid = false;
      }
      chunk.map(func);
      ++_rate;
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