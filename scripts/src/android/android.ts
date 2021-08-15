export namespace android {
    export const deviceSerial = (): String => {
        //android的hidden API，需要通过反射调用
        // const SP = Java.use("android.os.SystemProperties");
        let tmp: String = "";
        if (Java.available) {
            Java.perform(() => {
                console.log("Build.SERIAL");
                const SystemProperties = Java.use("com.ss.android.deviceregister.DeviceRegisterManager")
                SystemProperties.getDeviceId.implementation = function (){
                    tmp = this.getDeviceId();
                    console.log(tmp)
                    return tmp;
                }
                // Java.choose("com.bytedance.android.live.core.h.ad", {
                //     onComplete: function (){},
                //     onMatch: function (instance) {
                //         tmp = instance.a("ro.serialno");
                //         console.log("live.core.h.ad");
                //         console.log(tmp)
                //     }
                // })
            })
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
    }
}

setImmediate(android.deviceSerial)