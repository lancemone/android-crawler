
export const tiktokFeedAweme = function (){
    const clazz: string = "com.ss.android.ugc.aweme.feed.model.Aweme";
    if (Java.available) {
        Java.perform(() => {
            const targetClass = Java.use(clazz);
            const throwable = Java.use("java.lang.Throwable");
            try {
                targetClass.isAd.implementation = function () {
                    const author = this.getAuthor();
                    const video = this.getVideo();
                    const statistics = this.getStatistics();
                    tiktokAwemeObject.aweme_id = this.getAid();
                    tiktokAwemeObject.author.uid = author.getUid();
                    tiktokAwemeObject.author.unique_id = author.getUniqueId();
                    tiktokAwemeObject.author.language = author.getLanguage();
                    tiktokAwemeObject.author.region = author.getRegion();
                    tiktokAwemeObject.video.height = video.getHeight();
                    tiktokAwemeObject.video.width = video.getWidth();
                    tiktokAwemeObject.video.duration = video.getVideoLength();
                    tiktokAwemeObject.video.play_addr.uri = video.getPlayAddr().getUri();
                    tiktokAwemeObject.video.play_addr.url_list = video.getPlayAddr().getUrlList();
                    tiktokAwemeObject.video.cover.uri = video.getCover().getUri();
                    tiktokAwemeObject.video.cover.url_list = video.getCover().getUrlList();
                    tiktokAwemeObject.video.cover.height = video.getCover().getHeight();
                    tiktokAwemeObject.video.cover.width = video.getCover().getWidth();
                    tiktokAwemeObject.statistics.aweme_id = statistics.getAid();
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
                    message.aweme_list.push(tiktokAwemeObject)
                    send(JSON.stringify(message));
                    return this.isAd();
                }
            }catch (e) {
                message.status_code = 10000;
                send("error: " + e.toString())
            }
        })
    }
}

type response = {status_code: number, aweme_list: Array<Object>};
const message: response = {
    status_code: 0,
    aweme_list: []
}

// @ts-ignore
const tiktokAwemeObject = {
    aweme_id: String,
    desc: String,
    create_time: String,
    author: {
        uid: String,        // 作者id
        unique_id: String,  // 作者unique id
        nickname: String,   // 作者昵称
        language: String,   // 语言
        region: String,     // 所属国家，非必须
    },
    video: {
        duration: 0, // 视频时长
        height: 0, // 视频高度
        width: 0, // 视频宽度
        // 播放地址
        play_addr:{
            uri: String,
            url_list: Array,    // 视频播放列表，目前我取的是 第一个包含 tiktokcdn 的播放地址
        },
        // 封面图
        cover:{
            uri: String,
            url_list: Array,    // 取的是这个列表中的第一个作为封面图片
            width: 0,
            height: 0,
        }, 
    },
    //  相关互动数据
    statistics:{
        aweme_id: String,
        comment_count: 0, // 评论数
        digg_count: 0, // 点赞数
        download_count: 0, // 下载数
        play_count: 0, // 播放数
        share_count: 0, // 分享数
        forward_count: 0, // 转发数
        lose_count: 0,
        lose_comment_count: 0,
        whatsapp_share_count: 0,
    },
    desc_language: String,
    region: String,
    awemeType: 0
}