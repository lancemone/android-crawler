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
        ["6997032603971044866", "HT7BF1A01506"],
        ["6993325258918430214", "FA79T1A05204"],
        ["6995105490510808581", "FA79Y1A01775"]
    ])

    // 设备和国家的对应关系
    // CI 612 科特迪瓦
    // ML 610 马里
    // GH 620 加纳
    // KE 639 肯尼亚
    export const deviceIdToRegion = new Map<String, String>([
        ["6993301494053717506", "CI"],
        ["6997032603971044866", "ML"],
        ["6993325258918430214", "GH"],
        ["6995105490510808581", "KE"]
    ])

    export const deviceIdToMcc = new Map<String, Number>([
        ["6993301494053717506", 612],
        ["6997032603971044866", 610],
        ["6993325258918430214", 620],
        ["6995105490510808581", 639]
    ])
}