import threading
import uiautomator2 as u2


class TiktokSwipeFeed(threading.Thread):
    def __init__(self, serial: str, following: bool):
        super(TiktokSwipeFeed, self).__init__()
        self.device = u2.connect_usb(serial)
        self.is_following = following
        self.name = f"${serial}-tfl" if following else f"${serial}-tfy"
        threading.local()

    def run(self):
        app_current = self.device.app_current
        if app_current["package"] == "com.ss.android.ugc.trill":
            print(self.name)


