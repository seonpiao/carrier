#!/bin/bash
backup_path="/log/nginx"

year=$(date +"%Y")
month=$(date +"%m")
date=$(date +"%d")
stat_time="0"

log_path=${backup_path}/${year}/${month}/${date}/static_pb/access_${year}${month}${date}1805*

total=`cat ${log_path} | grep "play.gif" -c`
error=`cat ${log_path} | grep "type=playerror" -c`
letv_total=`cat ${log_path} | grep "play.gif.*letv.com" -c`
letv_error=`cat ${log_path} | grep "type=playerror.*letv.com" -c`

iqiyi_total=`cat ${log_path} | grep "play.gif.*iqiyi.com" -c`
iqiyi_error=`cat ${log_path} | grep "type=playerror.*iqiyi.com" -c`

youku_total=`cat ${log_path} | grep "play.gif.*youku.com" -c`
youku_error=`cat ${log_path} | grep "type=playerror.*youku.com" -c`

tudou_total=`cat ${log_path} | grep "play.gif.*tudou.com" -c`
tudou_error=`cat ${log_path} | grep "type=playerror.*tudou.com" -c`

sohu_total=`cat ${log_path} | grep "play.gif.*sohu.com" -c`
sohu_error=`cat ${log_path} | grep "type=playerror.*sohu.com" -c`

pps_total=`cat ${log_path} | grep "play.gif.*pps.tv" -c`
pps_error=`cat ${log_path} | grep "type=playerror.*pps.tv" -c`

kankan_total=`cat ${log_path} | grep "play.gif.*kankan.com" -c`
kankan_error=`cat ${log_path} | grep "type=playerror.*kankan.com" -c`

qq_total=`cat ${log_path} | grep "play.gif.*qq.com" -c`
qq_error=`cat ${log_path} | grep "type=playerror.*qq.com" -c`

sina_total=`cat ${log_path} | grep "play.gif.*sina.com" -c`
sina_error=`cat ${log_path} | grep "type=playerror.*sina.com" -c`

com56_total=`cat ${log_path} | grep "play.gif.*56.com" -c`
com56_error=`cat ${log_path} | grep "type=playerror.*56.com" -c`

cntv_total=`cat ${log_path} | grep "play.gif.*cntv.com" -c`
cntv_error=`cat ${log_path} | grep "type=playerror.*cntv.com" -c`

pptv_total=`cat ${log_path} | grep "play.gif.*pptv.com" -c`
pptv_error=`cat ${log_path} | grep "type=playerror.*pptv.com" -c`

fun_total=`cat ${log_path} | grep "play.gif.*fun.tv" -c`
fun_error=`cat ${log_path} | grep "type=playerror.*fun.tv" -c`

com1905_total=`cat ${log_path} | grep "play.gif.*1905.com" -c`
com1905_error=`cat ${log_path} | grep "type=playerror.*1905.com" -c`

ku6_total=`cat ${log_path} | grep "play.gif.*ku6.com" -c`
ku6_error=`cat ${log_path} | grep "type=playerror.*ku6.com" -c`

baomihua_total=`cat ${log_path} | grep "play.gif.*baomihua.com" -c`
baomihua_error=`cat ${log_path} | grep "type=playerror.*baomihua.com" -c`

baidu_total=`cat ${log_path} | grep "play.gif.*baidu.com" -c`
baidu_error=`cat ${log_path} | grep "type=playerror.*baidu.com" -c`

(
echo "播放总数：${total}    出错总数：${error}"
echo "======================================================================"
echo "【乐视】      播放总数：${letv_total}    出错总数：${letv_error}"
echo "【爱奇艺】      播放总数：${iqiyi_total}    出错总数：${iqiyi_error}"
echo "【优酷】      播放总数：${youku_total}    出错总数：${youku_error}"
echo "【土豆】      播放总数：${tudou_total}    出错总数：${tudou_error}"
echo "【搜狐】      播放总数：${sohu_total}    出错总数：${sohu_error}"
echo "【pps】      播放总数：${pps_total}    出错总数：${pps_error}"
echo "【看看】      播放总数：${kankan_total}    出错总数：${kankan_error}"
echo "【腾讯】      播放总数：${qq_total}    出错总数：${qq_error}"
echo "【新浪】      播放总数：${sina_total}    出错总数：${sina_error}"
echo "【56】      播放总数：${com56_total}    出错总数：${com56_error}"
echo "【cntv】      播放总数：${cntv_total}    出错总数：${cntv_error}"
echo "【pptv】      播放总数：${pptv_total}    出错总数：${pptv_error}"
echo "【风行】      播放总数：${fun_total}    出错总数：${fun_error}"
echo "【1905】      播放总数：${com1905_total}    出错总数：${com1905_error}"
echo "【酷6】      播放总数：${ku6_total}    出错总数：${ku6_error}"
echo "【爆米花】      播放总数：${baomihua_total}    出错总数：${baomihua_error}"
echo "【百度】      播放总数：${baidu_total}    出错总数：${baidu_error}"
echo "======================================================================"
echo "播放出错前100个视频："
cat /log/nginx/2015/03/01/static_pb/access_201503010205* | grep "type=playerror" | awk '{print $7}' | awk -F '&' '{print $2}' | awk -F '=' '{print $2}' | xargs -i  node /root/code/scripts/urldecode.js {} | sort | uniq -c | sort -t ' ' -k 1 -n -r | tail -n 100
) | mail -s "[play_stat] ${year}-${month}-${date}" piaoshihuang@tvapk.net