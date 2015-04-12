define([ "modules/moduleRunner/index", "modules/header/index", "modules/nav/index", "modules/diamond/index", "modules/pkg/index", "modules/email/index", "modules/golden/index", "modules/sign/index", "modules/exchangeActivity/index", "modules/exchange/index", "modules/rank/index" ], function(ModuleRunner, header, nav, diamond, pkg, email, golden, sign, exchangeActivity, exchange, rank) {
  var modules = {
    header: header,
    nav: nav,
    diamond: diamond,
    pkg: pkg,
    email: email,
    golden: golden,
    sign: sign,
    exchangeActivity: exchangeActivity,
    exchange: exchange,
    rank: rank
  };
  ModuleRunner.run(modules);
});