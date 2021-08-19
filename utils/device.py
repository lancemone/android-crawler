# -*- coding: utf-8 -*-
"""
-------------------------------------------------
   File Name：     device
   Description :
   Author :       motao
   Mail :         tao.mo@transsnet.com
   date：          2021/8/17
-------------------------------------------------
"""
__author__ = 'motao'

import uiautomator2 as u2


def click_home(device: u2.Device) -> None:
    device.press('home')


def click_back(device: u2.Device) -> None:
    device.press('back')


def click_power(device: u2.Device) -> None:
    device.press('power')


def check_screen_locked(device: u2.Device) -> bool:
    m_showing_lockscreen = device.shell("dumpsys window policy |grep mShowingLockscreen").output
    is_status_bar_keyguard = device.shell("dumpsys window policy | grep isStatusBarKeyguard").output
    return "isStatusBarKeyguard=true" in is_status_bar_keyguard or "mShowingLockscreen=true" in m_showing_lockscreen


def screen_on(device: u2.Device) -> None:
    if device.info["screenOn"]:
        return
    else:
        device.screen_on()


def swipe_straight_up(device: u2.Device, duration: float = 0.8, steps: int = 10):
    """
    :rtype: 从屏幕中间位置的底部(屏幕height*duration)滑动到屏幕顶部
    :param device: u2的device对象实例
    :param duration: 屏幕高度的比例
    :param steps: 完成时间 step*10ms

    """
    width, height = display_width_and_height(device)
    device.swipe(fx=int(width * 0.5), fy=int(height * duration), tx=int(width*0.5), ty=0, steps=steps)


def unlock_device(d: u2.Device) -> bool:
    if check_screen_locked(d):
        if d.info["productName"] == "PD1602":      # vivo解锁
            try:
                screen_on(device=d)
                unlock_indicator = d.xpath(xpath='//*[@resource-id="com.android.systemui:id/viewpager"]')\
                    .wait(timeout=10)
                if unlock_indicator:
                    unlock_indicator.scroll()
                else:
                    screen_on(d)
                    swipe_straight_up(device=d, duration=0.9)
                d.xpath(xpath='//*[@resource-id="com.android.systemui:id/VivoPinkey1"]').click_exists(timeout=5)
                d.xpath(xpath='//*[@resource-id="com.android.systemui:id/VivoPinkey2"]').click_exists(timeout=5)
                d.xpath(xpath='//*[@resource-id="com.android.systemui:id/VivoPinkey3"]').click_exists(timeout=5)
                d.xpath(xpath='//*[@resource-id="com.android.systemui:id/VivoPinkey4"]').click_exists(timeout=5)
            except Exception as e:
                print(str(e))
        else:
            try:
                d.unlock()
                d.xpath(xpath='//*[@resource-id="com.android.systemui:id/key1"]').click_exists(timeout=5)
                d.xpath(xpath='//*[@resource-id="com.android.systemui:id/key2"]').click_exists(timeout=5)
                d.xpath(xpath='//*[@resource-id="com.android.systemui:id/key3"]').click_exists(timeout=5)
                d.xpath(xpath='//*[@resource-id="com.android.systemui:id/key4"]').click_exists(timeout=5)
                d.xpath(xpath='//*[@resource-id="com.android.systemui:id/key_enter"]').click_exists()
            except Exception as e:
                print(str(e))
    return check_screen_locked(d)


def display_width_and_height(device: u2.Device) -> tuple[int, int]:
    info = device.info
    return info.get("displayWidth"), info.get("displayHeight")
