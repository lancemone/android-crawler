export namespace android {
    export const deviceSerial = (): String => {
        let tmp: String = "";
        if (Java.available) {
            Java.perform(() => {
                Java.choose("com.ss.android.deviceregister.DeviceRegisterManager",{
                    onComplete: function (){},
                    onMatch:function (instance) {
                        tmp = instance.getDeviceId();
                    }
                })
            })
        }
        return tmp;
    };

    export const getApplicationContext = (): any => {
        const ActivityThread = Java.use("android.app.ActivityThread");
        const currentApplication = ActivityThread.currentApplication();
        return currentApplication.getApplicationContext();
    };

    export const deviceIdToSerial = new Map<String, String>([
        ["6993301494053717506", "FA79Y1A01745"],
        ["", "HT7BF1A01506"]
    ])

    // 设备和国家的对应关系
    export const deviceIdToRegion = new Map<String, String>([
        ["6993301494053717506", "CI"],
        ["FA79Y1A01743", "GH"],
    ])

    export const deviceIdToMcc = new Map<String, Number>([
        ["6993301494053717506", 612],
        ["FA79Y1A01743", 613]
    ])
}