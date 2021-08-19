# -*- coding: utf-8 -*-
"""
-------------------------------------------------
   File Name：     my_config
   Description :
   Author :       motao
   Mail :         tao.mo@transsnet.com
   date：          2021/8/17
-------------------------------------------------
"""
__author__ = 'motao'

tiktok_devices = ["FA7981A04395"]

tiktok_package_name = 'com.ss.android.ugc.trill'
tiktok_main_activity = ''
tiktok_element_min_wait_time: int = 30  # 元素最短等待时间，也是默认等待时间,单位s
tiktok_element_max_wait_time: int = 180  # 元素最长等待时间，单位s
tiktok_for_you_max_running_time: float = 2  # 单次任务最长执行时间
tiktok_following_max_running_time: float = 1

# tiktok 元素xpath
tiktok_xpath_video_list_scrollable = '//androidx.viewpager.widget.ViewPager'
tiktok_xpath_home_title = '//*[@resource-id="com.ss.android.ugc.trill:id/bo2"]'
tiktok_xpath_home_following_tab = '//android.widget.HorizontalScrollView/android.widget.LinearLayout[1]' \
                                  '/androidx.appcompat.app.ActionBar-b[1]'
tiktok_xpath_home_for_you_tab = '//android.widget.HorizontalScrollView/android.widget.LinearLayout[1]' \
                                '/androidx.appcompat.app.ActionBar-b[2]'
tiktok_xpath_home_play_layout = ''
tiktok_xpath_home_refresh = ''
tiktok_xpath_home_adl = '//*[@resource-id="com.ss.android.ugc.trill:id/acu"]'
tiktok_xpath_video_like = ''

tiktok_add_api = '/crawler/tiktok/add'
host = "https://management.more.buzz"
headers_more = {'token':      'sdjklfnfsrfgvdsvg',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                              'Chrome/70.0.3538.77 Safari/537.36'}


class CrawlerSort:
    INS_FOLLOWING = 'ifl'
    TT_FOLLOWING = 'tfl'
    TT_FOR_YOU = 'tfy'
