var mcc_ci = "612"  // 科特迪瓦
var mcc_gh = "620"  // 加纳
var NetworkUtilsClass = "com.ss.android.common.util.NetworkUtils"
// 修改接口中的carrier_region(国家简称)参数，方法public static final String i
var carrier_region_class = "com.ss.android.ugc.aweme.ak.d"
// 修改接口中的carrier_region_v2(mcc码)参数，方法public String a
var carrier_region_v2_class = "com.ss.android.ugc.trill.f.c"

function changeCarrierRegion() {
    if (Java.available) {
        Java.perform(function () {
            var CarrierRegion = Java.use(carrier_region_class);
            CarrierRegion.i.implementation = function () {
                send("start invoike changeCarrierRegion")
                return "CI"
            }
        })
    }
}


function changeCarrierRegionV2() {
    if (Java.available) {
        Java.perform(function () {
            var class_d = Java.use(carrier_region_v2_class)
            class_d.a.implementation = function () {
                console.log("start invoike changeCarrierRegionV2");
                return mcc_ci;
            }
        })
    }
}

function getCarrierRegion() {
    if (Java.available) {
        Java.perform(function () {
            var CarrierRegion = Java.use(carrier_region_v2_class);
            CarrierRegion.b.implementation = function () {
                var res = this.b
                send("" + res)
            }
        })
    }
}

setImmediate(changeCarrierRegion,0);
setImmediate(changeCarrierRegionV2,0);
// setImmediate(getCarrierRegion)


const AwameClass = "com.ss.android.ugc.aweme.feed.model.Aweme"
const UserClass = "com.ss.android.ugc.aweme.profile.model.User"

function tiktok_feed_aweme() {
    if(Java.available){
        var handles = {}
        Java.perform(function () {
            var cname = "com.ss.android.ugc.aweme.feed.model.Aweme";
            Java.choose(cname, {
                onComplete: function () {
                    console.log("end");
                },
                onMatch: function (instance) {
                    send(instance.hashcode())
                    var user = instance.getAuthor();
                    var user_unique_id = user.getUniqueId();
                    handles[instance.hashcode()] = {
                        unique_id: user_unique_id,
                        aweme: instance.toString(),
                    };
                    send(JSON.stringify(handles));
                }
            });
        });
        // return JSON.stringify(handles);
    }
}

function get_video_url() {
    if (Java.available) {
        Java.perform(function () {
            var cname = "com.ss.android.ugc.aweme.feed.model.Aweme";
            var c = Java.use(cname);
            var info = {};
            // c.getVideo.overload().implementation = function () {
            //     var resp = this.getVideo();
            //     info.videoUrl = resp.getPlayAddr().getUrlList().get(0).toString();
            //     send(JSON.stringify(info));
            //     console.log(JSON.stringify(info))
            //     return resp;
            // };
        });
    }
}


// rpc.exports = {
//     tiktokFeedAweme: tiktok_feed_aweme,
//     getVideoUrl: get_video_url,
// }

setImmediate(get_video_url)
// setImmediate(tiktok_feed_aweme)