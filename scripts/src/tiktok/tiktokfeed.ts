import {android} from "../android/android";

export const tiktokFeedAweme = function (){
    const clazz: string = "com.ss.android.ugc.aweme.feed.model.Aweme";
    if (Java.available) {
        Java.perform(() => {
            const targetClass = Java.use(clazz);
            const throwable = Java.use("java.lang.Throwable");
            const deviceId = android.deviceSerial()
            let serial: String | undefined = ''
            if (android.deviceIdToSerial.has(deviceId)) {
                serial = android.deviceIdToSerial.get(deviceId)
            }
            try {
                targetClass.isAd.implementation = function () {
                    const hash_code = this.hashCode();
                    if (aweme_hash.includes(hash_code)) {
                        return this.isAd();
                    }
                    aweme_hash.push(hash_code)
                    const author = this.getAuthor();
                    const video = this.getVideo();
                    const statistics = this.getStatistics();
                    const aweme_id = this.getAid();
                    tiktokAwemeObject.aweme_id = aweme_id;
                    tiktokAwemeObject.author.uid = author.getUid();
                    tiktokAwemeObject.author.unique_id = author.getUniqueId();
                    tiktokAwemeObject.author.language = author.getLanguage();
                    tiktokAwemeObject.author.region = author.getRegion();
                    tiktokAwemeObject.video.height = video.getHeight();
                    tiktokAwemeObject.video.width = video.getWidth();
                    tiktokAwemeObject.video.duration = video.getVideoLength();
                    tiktokAwemeObject.video.play_addr.uri = video.getPlayAddr().getUri();
                    tiktokAwemeObject.video.play_addr.url_list = [];
                    tiktokAwemeObject.video.play_addr.url_list.push(video.getPlayAddr().getUrlList().get(0).toString());
                    tiktokAwemeObject.video.cover.uri = video.getCover().getUri();
                    tiktokAwemeObject.video.cover.url_list = []
                    tiktokAwemeObject.video.cover.url_list.push(video.getCover().getUrlList().get(0).toString());
                    tiktokAwemeObject.video.cover.height = video.getCover().getHeight();
                    tiktokAwemeObject.video.cover.width = video.getCover().getWidth();
                    tiktokAwemeObject.statistics.aweme_id = aweme_id;
                    tiktokAwemeObject.statistics.digg_count = statistics.getDiggCount();
                    tiktokAwemeObject.statistics.comment_count = statistics.getCommentCount();
                    tiktokAwemeObject.statistics.download_count = statistics.getDownloadCount();
                    tiktokAwemeObject.statistics.forward_count = statistics.getForwardCount();
                    tiktokAwemeObject.statistics.lose_comment_count = statistics.getLoseCommentCount();
                    tiktokAwemeObject.statistics.lose_count = statistics.getLoseCount();
                    tiktokAwemeObject.statistics.play_count = statistics.getPlayCount();
                    tiktokAwemeObject.statistics.share_count = statistics.getShareCount();
                    tiktokAwemeObject.statistics.whatsapp_share_count = 0;
                    tiktokAwemeObject.region = this.getRegion();
                    tiktokAwemeObject.desc_language = this.getDescLanguage();
                    tiktokAwemeObject.awemeType = this.getAwemeType();
                    message.aweme_list.push(tiktokAwemeObject);
                    message.hash_code = hash_code;
                    if (serial != null) {
                        message.device = serial;
                    }
                    send(JSON.stringify(message));
                    return this.isAd();
                }
            }catch (e) {
                message.status_code = 10000;
                if (serial != null) {
                    message.device = serial;
                }
                message.msg = e.toString();
                send(JSON.stringify(message))
            }
        })
    }
}

type response = {device: String, hash_code: String,status_code: number, aweme_list: Array<Object>, msg: String};
const video_play_addr: string[] = []
const cover_url_addr: string[] = []
const aweme_hash: string[] = []
const message: response = {
    device: "",
    hash_code: "",
    status_code: 0,
    aweme_list: [],
    msg: ""
}

const tiktokAwemeObject = {
    aweme_id: String,
    desc: String,
    create_time: String,
    author: {
        uid: String,        // ??????id
        unique_id: String,  // ??????unique id
        nickname: String,   // ????????????
        language: String,   // ??????
        region: String,     // ????????????????????????
    },
    video: {
        duration: 0, // ????????????
        height: 0, // ????????????
        width: 0, // ????????????
        // ????????????
        play_addr:{
            uri: String,
            url_list: video_play_addr,    // ??????????????????????????????????????? ??????????????? tiktokcdn ???????????????
        },
        // ?????????
        cover:{
            uri: String,
            url_list: cover_url_addr,    // ??????????????????????????????????????????????????????
            width: 0,
            height: 0,
        },
    },
    //  ??????????????????
    statistics:{
        aweme_id: String,
        comment_count: 0, // ?????????
        digg_count: 0, // ?????????
        download_count: 0, // ?????????
        play_count: 0, // ?????????
        share_count: 0, // ?????????
        forward_count: 0, // ?????????
        lose_count: 0,
        lose_comment_count: 0,
        whatsapp_share_count: 0,
    },
    desc_language: String,
    region: String,
    awemeType: 0
}