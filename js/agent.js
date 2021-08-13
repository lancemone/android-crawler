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
const tiktokfeed_1 = require("./tiktok/tiktokfeed");
const tiktokregion_1 = require("./tiktok/tiktokregion");
setImmediate(tiktokregion_1.changeCarrierRegion);
setImmediate(tiktokregion_1.changeCarrierRegionV2);
setImmediate(tiktokfeed_1.tiktokFeedAweme);
}).call(this)}).call(this,require("timers").setImmediate)

},{"./tiktok/tiktokfeed":4,"./tiktok/tiktokregion":5,"timers":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiktokFeedAweme = void 0;
const tiktokFeedAweme = function () {
    const clazz = "com.ss.android.ugc.aweme.feed.model.Aweme";
    if (Java.available) {
        Java.perform(() => {
            const targetClass = Java.use(clazz);
            const throwable = Java.use("java.lang.Throwable");
            try {
                targetClass.isAd.implementation = function () {
                    const author = this.getAuthor();
                    const video = this.getVideo();
                    const statistics = this.getStatistics();
                    tiktokAwemeObject.aweme_id = this.getAid();
                    tiktokAwemeObject.author.uid = author.getUid();
                    tiktokAwemeObject.author.unique_id = author.getUniqueId();
                    tiktokAwemeObject.author.language = author.getLanguage();
                    tiktokAwemeObject.author.region = author.getRegion();
                    tiktokAwemeObject.video.height = video.getHeight();
                    tiktokAwemeObject.video.width = video.getWidth();
                    tiktokAwemeObject.video.duration = video.getVideoLength();
                    tiktokAwemeObject.video.play_addr.uri = video.getPlayAddr().getUri();
                    tiktokAwemeObject.video.play_addr.url_list = video.getPlayAddr().getUrlList();
                    tiktokAwemeObject.video.cover.uri = video.getCover().getUri();
                    tiktokAwemeObject.video.cover.url_list = video.getCover().getUrlList();
                    tiktokAwemeObject.video.cover.height = video.getCover().getHeight();
                    tiktokAwemeObject.video.cover.width = video.getCover().getWidth();
                    tiktokAwemeObject.statistics.aweme_id = statistics.getAid();
                    tiktokAwemeObject.statistics.digg_count = statistics.getDiggCount();
                    tiktokAwemeObject.statistics.comment_count = statistics.getCommentCount();
                    tiktokAwemeObject.statistics.download_count = statistics.getDownloadCount();
                    tiktokAwemeObject.statistics.forward_count = statistics.getForwardCount();
                    tiktokAwemeObject.statistics.lose_comment_count = statistics.getLoseCommentCount();
                    tiktokAwemeObject.statistics.lose_count = statistics.getLoseCount();
                    tiktokAwemeObject.statistics.play_count = statistics.getPlayCount();
                    tiktokAwemeObject.statistics.share_count = statistics.getShareCount();
                    tiktokAwemeObject.statistics.whatsapp_share_count = 0;
                    tiktokAwemeObject.region = this.getRegion();
                    tiktokAwemeObject.desc_language = this.getDescLanguage();
                    tiktokAwemeObject.awemeType = this.getAwemeType();
                    message.aweme_list.push(tiktokAwemeObject);
                    send(JSON.stringify(message));
                    return this.isAd();
                };
            }
            catch (e) {
                message.status_code = 10000;
                send("error: " + e.toString());
            }
        });
    }
};
exports.tiktokFeedAweme = tiktokFeedAweme;
const message = {
    status_code: 0,
    aweme_list: []
};
// @ts-ignore
const tiktokAwemeObject = {
    aweme_id: String,
    desc: String,
    create_time: String,
    author: {
        uid: String,
        unique_id: String,
        nickname: String,
        language: String,
        region: String, // 所属国家，非必须
    },
    video: {
        duration: 0,
        height: 0,
        width: 0,
        // 播放地址
        play_addr: {
            uri: String,
            url_list: Array, // 视频播放列表，目前我取的是 第一个包含 tiktokcdn 的播放地址
        },
        // 封面图
        cover: {
            uri: String,
            url_list: Array,
            width: 0,
            height: 0,
        },
    },
    //  相关互动数据
    statistics: {
        aweme_id: String,
        comment_count: 0,
        digg_count: 0,
        download_count: 0,
        play_count: 0,
        share_count: 0,
        forward_count: 0,
        lose_count: 0,
        lose_comment_count: 0,
        whatsapp_share_count: 0,
    },
    desc_language: String,
    region: String,
    awemeType: 0
};
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCarrierRegionV2 = exports.changeCarrierRegion = void 0;
const changeCarrierRegion = function () {
    const clazz = "com.ss.android.ugc.aweme.ak.d";
    if (Java.available) {
        Java.perform(() => {
            // let serial = deviceSerial()
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
},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJzcmMvaW5kZXgudHMiLCJzcmMvdGlrdG9rL3Rpa3Rva2ZlZWQudHMiLCJzcmMvdGlrdG9rL3Rpa3Rva3JlZ2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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
