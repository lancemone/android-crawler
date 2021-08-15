(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
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
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
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
        runTimeout(drainQueue);
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)

},{"process/browser.js":1,"timers":2}],3:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.android = void 0;
var android;
(function (android) {
    android.deviceSerial = () => {
        //android的hidden API，需要通过反射调用
        // const SP = Java.use("android.os.SystemProperties");
        let tmp = "";
        if (Java.available) {
            Java.perform(() => {
                console.log("Build.SERIAL");
                const SystemProperties = Java.use("com.ss.android.deviceregister.DeviceRegisterManager");
                SystemProperties.getDeviceId.implementation = function () {
                    tmp = this.getDeviceId();
                    console.log(tmp);
                    return tmp;
                };
                // Java.choose("com.bytedance.android.live.core.h.ad", {
                //     onComplete: function (){},
                //     onMatch: function (instance) {
                //         tmp = instance.a("ro.serialno");
                //         console.log("live.core.h.ad");
                //         console.log(tmp)
                //     }
                // })
            });
        }
        return tmp;
        // SP.get.overload('java.lang.String').implementation = function (p1: any) {
        //     tmp = this.get(p1);
        //     console.log("[*]" + p1 + " : " + tmp);
        // }
        // SP.get.overload('java.lang.String', 'java.lang.String').implementation = function (p1: any, p2:any) {
        //
        //     tmp = this.get(p1, p2)
        //     console.log("[*]" + p1 + "," + p2 + " : " + tmp);
        // }
    };
})(android = exports.android || (exports.android = {}));
setImmediate(android.deviceSerial);
}).call(this)}).call(this,require("timers").setImmediate)

},{"timers":2}],4:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tiktokregion_1 = require("./tiktok/tiktokregion");
setImmediate(tiktokregion_1.changeCarrierRegion);
setImmediate(tiktokregion_1.changeCarrierRegionV2);
// setImmediate(tiktokFeedAweme)
}).call(this)}).call(this,require("timers").setImmediate)

},{"./tiktok/tiktokregion":5,"timers":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCarrierRegionV2 = exports.changeCarrierRegion = void 0;
const android_1 = require("../android/android");
var deviceSerial = android_1.android.deviceSerial;
const changeCarrierRegion = function () {
    const clazz = "com.ss.android.ugc.aweme.ak.d";
    if (Java.available) {
        Java.perform(() => {
            console.log("deviceSerial");
            let serial = deviceSerial();
            console.log(serial);
            const carrierRegion = Java.use(clazz);
            carrierRegion.i.implementation = function () {
                // let region: Array<any> | undefined = serialToRegion.get("default")
                // if (serialToRegion.has(serial)) {
                //     region = serialToRegion.get(serial)
                // }
                // console.log('changeCarrierRegion: ${serial}-${region[0]}')
                return "CI";
            };
        });
    }
};
exports.changeCarrierRegion = changeCarrierRegion;
const changeCarrierRegionV2 = function () {
    const clazz = "com.ss.android.ugc.trill.f.c";
    if (Java.available) {
        Java.perform(function () {
            // const serial = deviceSerial()
            const class_d = Java.use(clazz);
            class_d.a.implementation = function () {
                // let region: Array<any> | undefined = serialToRegion.get("default")
                // if (serialToRegion.has(serial)) {
                //     region = serialToRegion.get(serial)
                // }
                console.log("changeCarrierRegionV2: ${serial}-${region[1]}");
                return 612;
            };
        });
    }
};
exports.changeCarrierRegionV2 = changeCarrierRegionV2;
// 设备和国家的对应关系
const serialToRegion = new Map([
    ["FA79Y1A01745", ["CI", 612]],
    ["FA79Y1A01743", ["GH", 620]],
    ["default", ["NG", 630]]
]);
},{"../android/android":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJzcmMvYW5kcm9pZC9hbmRyb2lkLnRzIiwic3JjL2luZGV4LnRzIiwic3JjL3Rpa3Rvay90aWt0b2tyZWdpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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
