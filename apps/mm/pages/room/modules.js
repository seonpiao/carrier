define([ "modules/moduleRunner/index", "modules/mm_chat/index", "modules/header/index", "modules/nav/index", "modules/diamond/index", "modules/girl/index", "modules/happy/index", "modules/task/index", "modules/angelList/index", "modules/quicklink/index", "modules/shop/index", "modules/food/index", "modules/gift/index", "modules/homefurn/index", "modules/clothes/index", "modules/game/index", "modules/itemdetail/index", "modules/crit/index", "modules/numtip/index", "modules/raise/index", "modules/countdown/index", "modules/feed/index", "modules/pkg/index", "modules/email/index", "modules/activity/index", "modules/girltask/index", "modules/groom/index", "modules/golden/index", "modules/persiashop/index", "modules/constellation/index", "modules/bottle/index", "modules/sign/index", "modules/errmsg/index", "modules/flash/index", "modules/insufficient/index", "modules/exchange/index", "modules/baidu/index", "modules/rank/index", "modules/squarenotice/index", "modules/lovetransfer/index", "modules/room980/index", "modules/exchange/activity", "modules/ladygameresult/index", "modules/userfeed/index" ], function(ModuleRunner, mm_chat, header, nav, diamond, girl, happy, task, angelList, quicklink, shop, food, gift, homefurn, clothes, game, itemdetail, crit, numtip, raise, countdown, feed, pkg, email, activity, girltask, groom, golden, persiashop, constellation, bottle, sign, errmsg, flash, insufficient, exchange, baidu, rank, squarenotice, lovetransfer, room980, exchangeActivity, ladygameresult, userfeed) {
  var modules = {
    mm_chat: mm_chat,
    header: header,
    nav: nav,
    diamond: diamond,
    girl: girl,
    happy: happy,
    task: task,
    angelList: angelList,
    quicklink: quicklink,
    shop: shop,
    food: food,
    gift: gift,
    homefurn: homefurn,
    clothes: clothes,
    game: game,
    itemdetail: itemdetail,
    crit: crit,
    numtip: numtip,
    raise: raise,
    countdown: countdown,
    feed: feed,
    pkg: pkg,
    email: email,
    activity: activity,
    girltask: girltask,
    groom: groom,
    golden: golden,
    persiashop: persiashop,
    constellation: constellation,
    bottle: bottle,
    sign: sign,
    errmsg: errmsg,
    flash: flash,
    insufficient: insufficient,
    exchange: exchange,
    baidu: baidu,
    rank: rank,
    squarenotice: squarenotice,
    lovetransfer: lovetransfer,
    room980: room980,
    exchangeActivity: exchangeActivity,
    ladygameresult: ladygameresult,
    userfeed: userfeed
  };
  ModuleRunner.run(modules);
});