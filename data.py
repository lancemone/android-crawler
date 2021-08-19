# -*- coding: utf-8 -*-
"""
-------------------------------------------------
   File Name：     data
   Description :
   Author :       motao
   Mail :         tao.mo@transsnet.com
   date：          2021/8/18
-------------------------------------------------
"""
__author__ = 'motao'


def get_count_by_device(file_path):
    dm = {}
    with open(file_path, 'r', encoding='utf-8') as f:
        for l in f.readlines():
            device = l.split('-')[0]
            if device in dm.keys():
                dm[device] = dm[device] + 1
            else:
                dm[device] = 1
    return dm


def get_only_count_by_device(file_path):
    dm: dict[str, set] = {}
    dmn: dict[str, int] = {}
    with open(file_path, 'r', encoding='utf-8') as f:
        for l in f.readlines():
            device, aweme = l.split('-')
            if device in dm.keys():
                dm[device].add(aweme)
            else:
                dm[device] = {aweme}
    for k in dm.keys():
        dmn[k] = len(dm[k])
    return dmn


def get_only_count(file_path):
    count = set()
    with open(file_path, 'r', encoding='utf-8') as f:
        for l in f.readlines():
            device, aweme = l.split('-')
            count.add(aweme)
    return len(count)


if __name__ == '__main__':
    file_name = r'D:\Code\Python\request.log'
    print(get_count_by_device(file_name))
    print(get_only_count_by_device(file_name))
    print(get_only_count(file_name))