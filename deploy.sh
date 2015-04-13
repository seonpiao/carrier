#!/bin/bash

test=(192.168.1.200)
production=(123.56.152.17)
staticdir="../web/code/static/"
staticurl="http://online.static.mm.wanleyun.com/"
server_host="182.92.215.90"
server_path="/data/wwwroot/wanleyun/static/dist"
upload_dirs=(js css template)

users=(master wujunlian piaoshihuang feng staging)

env=$1
user=$2

if [ "$env" = "production" ]; then
  hosts=(${production[@]})
elif [ "$env" = "test" ]; then
  hosts=(${test[@]})
  for loop in ${users[@]}
  do
    if [[ $loop = $user ]]
    then
      userFlag=true
    fi
  done

  if [[ $userFlag = true ]]; then
    echo "$user"
  else
    echo "请写出你的美名，wujunlian or piaoshihuang or feng"
    exit
  fi

else
  echo '请指定正确的上线环境，test or production'
  exit
fi

num=${#hosts[@]}

gitchange=($(git status -bs | grep "^[^#]"))
gitchangecount=${#gitchange[@]}

if [ $gitchangecount -gt 2 ]; then
  echo '请先提交代码的修改'
  exit
fi

gitahead=($(git status -bs | grep "ahead \d"))
gitaheadcount=${#gitahead[@]}

if [ $gitaheadcount -gt 2 ]; then
  echo '请先把代码push到server'
  exit
fi

# if [ "$env" = "production" ]; then
#   choice="n"
read -p "Deploy to ${hosts[*]}: (y/n)" choice
# fi

if [ "$choice" = "y" ]; then

  rm -rf dist
  rm -rf temp

  #编译代码
  grunt build

  #提交git
  git add .
  if [[ $userFlag = true ]]; then
    git commit -m "online for $user"
  else
    git commit -m online 
  fi
  git push
  
  #备份dist到temp，后续还需要还原回来
  cp -rf dist/ temp/

  #把编译好的文件上传到server
  dircount=${#upload_dirs[@]}
  str=""
  for((i=0;i<dircount;i++));do
    #删除不带md5值的文件，这些文件不需要提交到服务器上
    find dist/${upload_dirs[i]}/ -name "*.*"  | grep -v '\.\w\{16\}\.' | sed  's/\/\{1,\}/\//g' | xargs rm -f
    #copy到static server
    scp -r dist/${upload_dirs[i]}/ root@$server_host:$server_path
    str="${str} ./dist/${upload_dirs[i]}"
  done

  #还原dist的文件
  cp -rf temp/ dist/

  # 检查是否所有文件已经同步到线上
  files=($(find ${str} -name "*.*"  | grep '\.\w\{16\}\.' | awk -F '^./' '{print $2}' | sed 's/\/\//\//g'))
  filescount=${#files[@]}
  for((i=0;i<filescount;i++));do
    staticfileurl="${staticurl}${files[i]}"
    httpcode=""
    while [ "$httpcode" != "200" ]
    do
      httpcode=`curl -I -o /dev/null -s -w %{http_code} -H 'Host:static.mm.wanleyun.com' ${staticfileurl}`
      echo "$httpcode - ${staticfileurl}"
      wait
      if [ "$httpcode" != "200" ]; then
        sleep 10s
      fi
    done
  done

  #更新Node服务
  for((i=0;i<num;i++));do
    echo deploy to ${hosts[i]}
    if [ "$env" = "production" ]; then
      ssh root@${hosts[i]} "dsh -M -r ssh -g node -q -- 'cd /root/code/carrier && git pull && /usr/local/node/bin/pm2 reload carrier'"
    else
      ssh root@${hosts[i]} "cd /root/code/${user} && git pull && /usr/local/bin/pm2 reload ${user}"
    fi
  done
fi
