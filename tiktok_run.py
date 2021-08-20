# -*- coding: utf-8 -*-
"""
-------------------------------------------------
   File Name：     tiktok_run
   Description :
   Author :       motao
   Mail :         tao.mo@transsnet.com
   date：          2021/8/12
-------------------------------------------------
"""
__author__ = 'motao'

import datetime

from apscheduler.schedulers.blocking import BlockingScheduler

from demo.tiktok import tiktok_feed
from demo import tiktok_swipe
import multiprocessing
import utils
from utils import my_config
import uploader


def main():
    scheduler = BlockingScheduler()
    scheduler.add_job(func=tiktok_run, trigger='interval', hours=5,
                      name="tiktok_following_feed_task",
                      next_run_time=datetime.datetime.now())
    scheduler.start()


def tiktok_run():
    utils.write_task_number_same_day(my_config.CrawlerSort.TT_FOR_YOU)
    is_end = multiprocessing.Value('d', 0)
    swipe_process = multiprocessing.Process(target=tiktok_feed_swipe, args=(tiktok_feed.get_devices_ids, is_end,))
    swipe_process.start()
    hooking_process = multiprocessing.Process(target=hooking_tiktok, args=(is_end,))
    hooking_process.start()
    swipe_process.join()
    hooking_process.join()
    tiktok_swipe.TiktokSwipeFeed()


def hooking_tiktok(is_end):
    # tiktok_feed.set_is_end(is_end)
    tiktok_feed.inject(is_end=is_end)


def tiktok_feed_swipe(devices, is_end):
    thread_list = []
    # devices = ['FA79Y1A01745', 'HT7BF1A01506']
    if devices:
        for did in devices:
            print(did)
            t = tiktok_swipe.TiktokSwipeFeed(serial=did, following=False)
            thread_list.append(t)
    for t in thread_list:
        t.start()
    for t in thread_list:
        t.join()
    is_end.value = 1


class App(object):
    def __init__(self):
        self.end = False

    def is_end(self):
        return self.end

    def set_end(self):
        self.end = True


if __name__ == "__main__":
   main()
