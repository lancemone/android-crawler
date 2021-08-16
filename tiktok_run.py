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

import time

from demo.tiktok import tiktok_feed
from demo import tiktok_swipe
import multiprocessing
from multiprocessing.managers import BaseManager


def tiktok_run():
    manager = BaseManager()
    manager.register("App", App)
    manager.start()
    app = manager.App()
    process_list = []
    hooking_process = multiprocessing.Process(target=hooking_tiktok, args=(app,))
    hooking_process.start()
    swipe_process = multiprocessing.Process(target=tiktok_feed_swipe, args=(tiktok_feed.get_devices_ids, app,))
    swipe_process.start()
    swipe_process.join()
    hooking_process.join()


def hooking_tiktok(app):
    tiktok_feed.inject()


def tiktok_feed_swipe(devices, app):
    thread_list = []
    if devices:
        for did in devices:
            t = tiktok_swipe.TiktokSwipeFeed(serial=did, following=False)
            thread_list.append(t)
    for t in thread_list:
        t.start()
    for t in thread_list:
        t.join()
    app.set_end()


class App(object):
    def __init__(self):
        self.end = False

    def is_end(self):
        return self.end

    def set_end(self):
        self.end = True


if __name__ == "__main__":
    tiktok_run()
