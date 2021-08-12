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
                console.log("start invoike changeCarrierRegion")
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

// setImmediate(changeCarrierRegion,0);
// setImmediate(changeCarrierRegionV2,0);
// setImmediate(getCarrierRegion)


const AwameClass = "com.ss.android.ugc.aweme.feed.model.Aweme"
const UserClass = "com.ss.android.ugc.aweme.profile.model.User"

function get_aweme() {
    var handles = {};
    send("get_aweme")
    if (Java.available) {
        Java.choose(AwameClass, {
            onComplete: function () {
                send("end");
            },
            onMatch: function (instance) {
                var user = instance.getAuthor()
                var user_unique_id = user.getUniqueId()
                send(user_unique_id)
                send(instance.hashCode())
                handles[AwameClass].push({
                    instance: instance,
                    hashcode: instance.hashCode(),
                    unique_id: user_unique_id,
                });
            },
        });
        return handles;
        // return handles[AwameClass].map((h) => {
        //     return {
        //         hashcode: h.hashcode,
        //         unique_id: h.unique_id,
        //         aweme: h.instance.toString(),
        //     }
        // })
    }
}

function get_video_url() {
    if (Java.available) {
        Java.perform(function () {
            var cname = "com.ss.android.ugc.aweme.feed.model.Aweme";
            var c = Java.use(cname);
            var info = {};
            c.getVideo.overload().implementation = function () {
                var resp = this.getVideo();
                info.videoUrl = resp.getPlayAddr().getUrlList().get(0).toString();
                return resp;
            };
            send(info)
        });
    }
}


rpc.exports = {
    tiktokAweme: get_aweme,
    getVideoUrl: get_video_url,
}