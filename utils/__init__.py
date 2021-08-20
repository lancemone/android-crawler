import time
from datetime import datetime
import os
import json
from random import random


def get_normal_format_data():
    return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())


def get_logfile_data():
    return time.strftime('%Y%m%d_%H%M%S', time.localtime())


def get_utc_format_time():
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")


def get_utc_logfile_data():
    return datetime.utcnow().strftime("%Y%m%d_%H%M%S")


# 根据概率返回True
def probabilistic_event(probabilistic: float(2)) -> bool:
    if random() >= probabilistic:
        return False
    return True


def write_task_number_same_day(sort) -> None:
    dic_platform = {}
    local_date = str(datetime.utcnow().date())
    data = {
        "date": local_date,
        "num":  1
    }
    lib_path = os.path.join(os.path.dirname(__file__), "lib")
    os.makedirs(name=lib_path, exist_ok=True)
    file_path = os.path.join(lib_path, "task_number_same_day.json")
    if not os.path.exists(file_path):
        with open(file_path, 'w', encoding='utf-8') as r:
            r.close()
    with open(file_path, 'r', encoding='utf-8') as f:
        value = f.read()
    if not value:
        dic_platform[sort] = data
    else:
        dic_platform = json.loads(value)
        if sort not in dic_platform.keys():
            dic_platform[sort] = data
        else:
            platform_data = dic_platform[sort]
            num_next = platform_data["num"]
            if local_date == platform_data["date"]:
                num_next += 1
            else:
                num_next = 1
            platform_data["num"] = num_next
            platform_data["date"] = local_date
            dic_platform[sort] = platform_data
    with open(file_path, 'w', encoding='utf-8') as w:
        w.write(json.dumps(dic_platform))
    # num = dic_platform[sort]["num"]
    # return "{0}-{1}-{2}".format(local_date, num, sort)


def read_task_number_same_day(sort) -> str:
    file_path = os.path.join(os.path.join(os.path.dirname(__file__), "lib"), "task_number_same_day.json")
    try:
        with open(file_path, "r", encoding='utf-8') as f:
            value = f.read()
        if value:
            json_value = json.loads(value)
            platform_data = json_value[sort]
            num = platform_data["num"]
            local_date = platform_data["date"]
            return "{0}-{1}-{2}-new".format(local_date, num, sort)
    except Exception as e:
        print(str(e))
        return ''


def crawler_print(file_name: str, message: str) -> None:
    print(message)
    with(open(file_name, 'a+', encoding='utf-8')) as f:
        f.write(message)
