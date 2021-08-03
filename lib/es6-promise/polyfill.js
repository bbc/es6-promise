/*global self*/
import Promise from './promise';

export default function polyfill() {
  let local;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  let P = local.Promise;

  if (!P) {
    local.Promise = Promise;
    return;
  }


  var promiseToString = null;
  try {
    promiseToString = Object.prototype.toString.call(P.resolve());
  } catch(e) {
    // silently ignored
  }

  if (!(promiseToString === '[object Promise]' && !P.cast && typeof P.prototype.finally === 'function')) {
    local.Promise = Promise;
  } else {
    if (typeof local.Promise.all !== 'function') {
      local.Promise.all = Promise.all;
    }

    if (typeof local.Promise.race !== 'function') {
      local.Promise.race = Promise.race;
    }
  }
}
