export namespace android {
export const deviceSerial = (): String => {
        //android的hidden API，需要通过反射调用
        const SP = Java.use("android.os.SystemProperties");
        let tmp: String = "";
        SP.get.overload('java.lang.String').implementation = function (p1: any) {
            tmp = this.get(p1);
            console.log("[*]" + p1 + " : " + tmp);
        }
        SP.get.overload('java.lang.String', 'java.lang.String').implementation = function (p1: any, p2:any) {

            tmp = this.get(p1, p2)
            console.log("[*]" + p1 + "," + p2 + " : " + tmp);
        }
        return tmp;
    }
}