define([ "modules/moduleRunner/index", "modules/header/index", "modules/nav/index", "modules/diamond/index", "modules/pkg/index", "modules/email/index", "modules/golden/index", "modules/sign/index", "modules/exchange/index", "modules/appdowntemp/index" ], function(ModuleRunner, header, nav, diamond, pkg, email, golden, sign, exchange, appdowntemp) {
  var modules = {
    header: header,
    nav: nav,
    diamond: diamond,
    pkg: pkg,
    email: email,
    golden: golden,
    sign: sign,
    exchange: exchange,
    appdowntemp: appdowntemp
  };
  ModuleRunner.run(modules);
});