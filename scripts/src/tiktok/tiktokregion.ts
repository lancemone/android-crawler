import {android} from "../android/android";
import deviceSerial = android.deviceSerial;

export const changeCarrierRegion = function () {
    const clazz: string = "com.ss.android.ugc.aweme.ak.d";
    if (Java.available) {
        Java.perform(() => {
            console.log("deviceSerial")
            let serial = deviceSerial()
            console.log(serial)
            const carrierRegion = Java.use(clazz);
            carrierRegion.i.implementation = function (){
                // let region: Array<any> | undefined = serialToRegion.get("default")
                // if (serialToRegion.has(serial)) {
                //     region = serialToRegion.get(serial)
                // }
                // console.log('changeCarrierRegion: ${serial}-${region[0]}')
                return "CI"
            }
        })
    }
}

export const changeCarrierRegionV2 = function () {
    const clazz: string = "com.ss.android.ugc.trill.f.c";
    if (Java.available) {
        Java.perform(function () {
            // const serial = deviceSerial()
            const class_d = Java.use(clazz)
            class_d.a.implementation = function () {
                // let region: Array<any> | undefined = serialToRegion.get("default")
                // if (serialToRegion.has(serial)) {
                //     region = serialToRegion.get(serial)
                // }
                console.log("changeCarrierRegionV2: ${serial}-${region[1]}");
                return 612;
            }
        })
    }
}


// 设备和国家的对应关系
const serialToRegion = new Map<String, Array<any>>([
    ["FA79Y1A01745", ["CI", 612]],
    ["FA79Y1A01743", ["GH", 620]],
    ["default", ["NG", 630]]
])