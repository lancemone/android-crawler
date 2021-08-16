import {android} from "../android/android";
import deviceSerial = android.deviceSerial;
import androidVersion = Java.androidVersion;

export const changeCarrierRegion = function () {
    const clazz: string = "com.ss.android.ugc.aweme.ak.d";
    if (Java.available) {
        const serial = deviceSerial()
        Java.perform(() => {
            const carrierRegion = Java.use(clazz);
            carrierRegion.i.implementation = function (){
                let region: String | undefined = 'NG'
                if (android.deviceIdToRegion.has(serial)) {
                    region = android.deviceIdToRegion.get(serial)
                }
                // console.log(`changeCarrierRegion: ${serial}-${region}`)
                return region;
            }
        })
    }
}

export const changeCarrierRegionV2 = function () {
    const clazz: string = "com.ss.android.ugc.trill.f.c";
    if (Java.available) {
        const serial = deviceSerial()
        Java.perform(function () {
            const class_d = Java.use(clazz)
            class_d.a.implementation = function () {
                let mcc: Number | undefined = 630
                if (android.deviceIdToRegion.has(serial)) {
                    mcc = android.deviceIdToMcc.get(serial)
                }
                // console.log(`changeCarrierRegionV2: ${serial}-${mcc}`);
                return mcc;
            }
        })
    }
}