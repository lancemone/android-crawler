# -*- coding: utf-8 -*-
"""
-------------------------------------------------
   File Name：     __init__.py
   Description :
   Author :       motao
   Mail :         tao.mo@transsnet.com
   date：          2021/8/13
-------------------------------------------------
"""
__author__ = 'motao'

import json
import requests
from utils import my_config
import utils


class TiktokUploaderManager(object):
    def __init__(self):
        self.api = my_config.tiktok_add_api
        self.url = my_config.host + self.api
        self.sort = my_config.CrawlerSort.TT_FOR_YOU
        self.hash_code_list = []
        self.log_path = 'D:\\Code\\Python\\{}-request.log'\
            .format(utils.read_task_number_same_day(my_config.CrawlerSort.TT_FOR_YOU))

    def uploader_from_json(self, swipe_num: int, value: str):
        json_value = json.loads(value)
        if json_value["hash_code"] in self.hash_code_list:
            return
        self.hash_code_list.append(json_value["hash_code"])
        headers = my_config.headers_more
        headers["swipeNum"] = swipe_num
        headers["time"] = utils.read_task_number_same_day(self.sort)
        headers["device"] = json_value["device"]
        response = requests.post(
            url=self.url,
            json=json_value,
            headers=headers,
            timeout=10)
        if response.status_code == 200 and response.json()['bizCode'] == 10000:
            print(response.text)
            with open(r"D:\Code\Python\request.log", 'a+', encoding='utf-8') as f:
                f.write('{device}-{aweme}\n'
                        .format(device=json_value["device"], aweme=json_value["aweme_list"][0]["aweme_id"]))
        else:
            print(response.text)

    def get_hash_code_length(self):
        return len(self.hash_code_list)


tiktok_for_you_uploader = TiktokUploaderManager()
