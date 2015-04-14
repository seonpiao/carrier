define([ "modules/moduleRunner/index", "modules/header/index", "modules/nav/index", "modules/diamond/index", "modules/feed/index", "modules/pkg/index", "modules/email/index", "modules/activity/index", "modules/golden/index", "modules/persiashop/index", "modules/constellation/index", "modules/bottle/index", "modules/sign/index", "modules/squaremap/index", "modules/girlschedule/index", "modules/errmsg/index", "modules/flash/index", "modules/insufficient/index", "modules/exchange/index", "modules/popular/index", "modules/girllist/index", "modules/squarenotice/index", "modules/lovetransfer/index", "modules/mm_chat/index", "modules/exchange/activity", "modules/square980/index", "modules/m_vod/index" ], function(ModuleRunner, header, nav, diamond, feed, pkg, email, activity, golden, persiashop, constellation, bottle, sign, squaremap, girlschedule, errmsg, flash, insufficient, exchange, popular, girllist, squarenotice, lovetransfer, mm_chat, exchangeactivity, square980, m_vod) {
  var modules = {
    header: header,
    nav: nav,
    diamond: diamond,
    feed: feed,
    pkg: pkg,
    email: email,
    activity: activity,
    golden: golden,
    persiashop: persiashop,
    constellation: constellation,
    bottle: bottle,
    sign: sign,
    squaremap: squaremap,
    girlschedule: girlschedule,
    errmsg: errmsg,
    flash: flash,
    insufficient: insufficient,
    exchange: exchange,
    popular: popular,
    girllist: girllist,
    squarenotice: squarenotice,
    lovetransfer: lovetransfer,
    mm_chat: mm_chat,
    exchangeactivity: exchangeactivity,
    square980: square980,
    m_vod: m_vod
  };
  ModuleRunner.run(modules);
});