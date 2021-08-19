import threading
import time
import random
import utils
from datetime import datetime
from utils import my_config as config
from utils import device as du
import uiautomator2 as u2


class TiktokSwipeFeed(threading.Thread):
    def __init__(self, serial: str, following: bool = False):
        super(TiktokSwipeFeed, self).__init__()
        self.device = u2.connect_usb(serial)
        self.is_following = following
        self.name = f"${serial}-tfl" if following else f"${serial}-tfy"
        self.refresh_count = 0  # 点击重试按钮的次数,每次app重启后会重置
        self.swipe_count = 0
        self.last_adl = ''  # 上一页adl元素的文本
        self.swiped_num = 0  # app有效滑动次数
        self.log_path = 'D:\\Code\\Python\\{}-{}.log'\
            .format(serial, utils.read_task_number_same_day(config.CrawlerSort.TT_FOR_YOU))

    def run(self):
        app_current = self.device.app_current
        if self.device:
            self.device.implicitly_wait(config.tiktok_element_min_wait_time)
            start_time = datetime.now()
            utils.crawler_print(self.log_path, str(start_time))
            self.start_app(start_time)

    def start_app(self, start_time: datetime) -> None:
        adl_text = '0'  # 默认为0为了防止首屏内容获取不到adl元素
        try:
            running_time = 0
            # self.device.app_wait(config.tiktok_package_name, timeout=200, front=True)
            # self.device.xpath(xpath=config.tiktok_xpath_home_for_you_tab).click_exists()
            # 3600 * config.tiktok_for_you_max_running_time
            while True:
                if running_time < 3600 * config.tiktok_for_you_max_running_time:
                    du.unlock_device(self.device)
                    utils.crawler_print(self.log_path, self.device.serial + "Current total number of swiped: " + str(self.swipe_count))
                    utils.crawler_print(self.log_path, self.device.serial + " Current effective number of swiped: " + str(self.swiped_num))
                    title = self.device.xpath(xpath=config.tiktok_xpath_home_title).wait(
                        timeout=config.tiktok_element_max_wait_time)
                    if title:
                        adl = self.device.xpath(config.tiktok_xpath_home_adl).wait(timeout=10)
                        if adl:
                            adl_text = adl.text
                        if adl_text != self.last_adl:  # 存在一种情况是连续两屏都没有获取到adl，会导致少一次有效计数
                            time.sleep(random.randint(2, 10))
                            self.last_adl = adl_text
                            self.device.xpath(xpath=config.tiktok_xpath_video_list_scrollable).swipe('up')
                            self.swipe_count += 1
                            self.swiped_num += 1
                        else:
                            utils.crawler_print(self.log_path, self.device.serial + ' not a effective swipe')
                            self.device.xpath(xpath=config.tiktok_xpath_video_list_scrollable).swipe('up')
                            self.swipe_count += 1
                    else:
                        utils.crawler_print(self.log_path, 'not find title')
                else:
                    utils.crawler_print(self.log_path, 'over time')
                    break
                running_time = (datetime.now() - start_time).seconds
            self.device.app_stop(config.tiktok_package_name)
        except Exception as e:
            utils.crawler_print(self.log_path, str(e))

