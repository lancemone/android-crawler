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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.android = void 0;
var android;
(function (android) {
    android.deviceSerial = () => {
        let tmp = "";
        if (Java.available) {
            Java.perform(() => {
                Java.choose("com.ss.android.deviceregister.DeviceRegisterManager", {
                    onComplete: function () { },
                    onMatch: function (instance) {
                        tmp = instance.getDeviceId();
                    }
                });
            });
        }
        return tmp;
    };
    android.getApplicationContext = () => {
        const ActivityThread = Java.use("android.app.ActivityThread");
        const currentApplication = ActivityThread.currentApplication();
        return currentApplication.getApplicationContext();
    };
    android.deviceIdToSerial = new Map([
        ["6993301494053717506", "FA79Y1A01745"],
        ["6997032603971044866", "HT7BF1A01506"],
        ["6993325258918430214", "FA79T1A05204"],
        ["6995105490510808581", "FA79Y1A01775"]
    ]);
    // 设备和国家的对应关系
    // CI 612 科特迪瓦
    // ML 610 马里
    // GH 620 加纳
    // KE 639 肯尼亚
    android.deviceIdToRegion = new Map([
        ["6993301494053717506", "CI"],
        ["6997032603971044866", "ML"],
        ["6993325258918430214", "GH"],
        ["6995105490510808581", "KE"]
    ]);
    android.deviceIdToMcc = new Map([
        ["6993301494053717506", 612],
        ["6997032603971044866", 610],
        ["6993325258918430214", 620],
        ["6995105490510808581", 639]
    ]);
})(android = exports.android || (exports.android = {}));
},{}],4:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tiktokfeed_1 = require("./tiktok/tiktokfeed");
const tiktokregion_1 = require("./tiktok/tiktokregion");
setImmediate(tiktokregion_1.changeCarrierRegion);
setImmediate(tiktokregion_1.changeCarrierRegionV2);
setImmediate(tiktokfeed_1.tiktokFeedAweme);
}).call(this)}).call(this,require("timers").setImmediate)

},{"./tiktok/tiktokfeed":5,"./tiktok/tiktokregion":6,"timers":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiktokFeedAweme = void 0;
const android_1 = require("../android/android");
const tiktokFeedAweme = function () {
    const clazz = "com.ss.android.ugc.aweme.feed.model.Aweme";
    if (Java.available) {
        Java.perform(() => {
            const targetClass = Java.use(clazz);
            const throwable = Java.use("java.lang.Throwable");
            const deviceId = android_1.android.deviceSerial();
            let serial = '';
            if (android_1.android.deviceIdToSerial.has(deviceId)) {
                serial = android_1.android.deviceIdToSerial.get(deviceId);
            }
            try {
                targetClass.isAd.implementation = function () {
                    const hash_code = this.hashCode();
                    if (aweme_hash.includes(hash_code)) {
                        return this.isAd();
                    }
                    aweme_hash.push(hash_code);
                    const author = this.getAuthor();
                    const video = this.getVideo();
                    const statistics = this.getStatistics();
                    const aweme_id = this.getAid();
                    tiktokAwemeObject.aweme_id = aweme_id;
                    tiktokAwemeObject.author.uid = author.getUid();
                    tiktokAwemeObject.author.unique_id = author.getUniqueId();
                    tiktokAwemeObject.author.language = author.getLanguage();
                    tiktokAwemeObject.author.region = author.getRegion();
                    tiktokAwemeObject.video.height = video.getHeight();
                    tiktokAwemeObject.video.width = video.getWidth();
                    tiktokAwemeObject.video.duration = video.getVideoLength();
                    tiktokAwemeObject.video.play_addr.uri = video.getPlayAddr().getUri();
                    tiktokAwemeObject.video.play_addr.url_list = [];
                    tiktokAwemeObject.video.play_addr.url_list.push(video.getPlayAddr().getUrlList().get(0).toString());
                    tiktokAwemeObject.video.cover.uri = video.getCover().getUri();
                    tiktokAwemeObject.video.cover.url_list = [];
                    tiktokAwemeObject.video.cover.url_list.push(video.getCover().getUrlList().get(0).toString());
                    tiktokAwemeObject.video.cover.height = video.getCover().getHeight();
                    tiktokAwemeObject.video.cover.width = video.getCover().getWidth();
                    tiktokAwemeObject.statistics.aweme_id = aweme_id;
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
                    message.hash_code = hash_code;
                    if (serial != null) {
                        message.device = serial;
                    }
                    send(JSON.stringify(message));
                    return this.isAd();
                };
            }
            catch (e) {
                message.status_code = 10000;
                if (serial != null) {
                    message.device = serial;
                }
                message.msg = e.toString();
                send(JSON.stringify(message));
            }
        });
    }
};
exports.tiktokFeedAweme = tiktokFeedAweme;
const video_play_addr = [];
const cover_url_addr = [];
const aweme_hash = [];
const message = {
    device: "",
    hash_code: "",
    status_code: 0,
    aweme_list: [],
    msg: ""
};
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
            url_list: video_play_addr, // 视频播放列表，目前我取的是 第一个包含 tiktokcdn 的播放地址
        },
        // 封面图
        cover: {
            uri: String,
            url_list: cover_url_addr,
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
},{"../android/android":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCarrierRegionV2 = exports.changeCarrierRegion = void 0;
const android_1 = require("../android/android");
var deviceSerial = android_1.android.deviceSerial;
const changeCarrierRegion = function () {
    const clazz = "com.ss.android.ugc.aweme.ak.d";
    if (Java.available) {
        const serial = deviceSerial();
        console.log(serial);
        Java.perform(() => {
            const carrierRegion = Java.use(clazz);
            carrierRegion.i.implementation = function () {
                let region = 'NG';
                if (android_1.android.deviceIdToRegion.has(serial)) {
                    region = android_1.android.deviceIdToRegion.get(serial);
                }
                // console.log(`changeCarrierRegion: ${serial}-${region}`)
                return region;
            };
        });
    }
};
exports.changeCarrierRegion = changeCarrierRegion;
const changeCarrierRegionV2 = function () {
    const clazz = "com.ss.android.ugc.trill.f.c";
    if (Java.available) {
        const serial = deviceSerial();
        Java.perform(function () {
            const class_d = Java.use(clazz);
            class_d.a.implementation = function () {
                let mcc = 630;
                if (android_1.android.deviceIdToRegion.has(serial)) {
                    mcc = android_1.android.deviceIdToMcc.get(serial);
                }
                // console.log(`changeCarrierRegionV2: ${serial}-${mcc}`);
                return mcc;
            };
        });
    }
};
exports.changeCarrierRegionV2 = changeCarrierRegionV2;
},{"../android/android":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJzcmMvYW5kcm9pZC9hbmRyb2lkLnRzIiwic3JjL2luZGV4LnRzIiwic3JjL3Rpa3Rvay90aWt0b2tmZWVkLnRzIiwic3JjL3Rpa3Rvay90aWt0b2tyZWdpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUc7SUFDakMsTUFBTSxLQUFLLEdBQVcsOEJBQThCLENBQUM7SUFDckQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLFlBQVksRUFBRSxDQUFBO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDVCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQy9CLE9BQU8sQ0FBQyxDQUFDLENBQUMsY0FBYyxHQUFHO2dCQUN2QixJQUFJLEdBQUcsR0FBdUIsR0FBRyxDQUFBO2dCQUNqQyxJQUFJLGlCQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUN0QyxHQUFHLEdBQUcsaUJBQU8sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2lCQUMxQztnQkFDRCwwREFBMEQ7Z0JBQzFELE9BQU8sR0FBRyxDQUFDO1lBQ2YsQ0FBQyxDQUFBO1FBQ0wsQ0FBQyxDQUFDLENBQUE7S0FDTDtBQUNMLENBQUMsQ0FBQTtBQWhCWSxRQUFBLHFCQUFxQix5QkFnQmpDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIifQ==
