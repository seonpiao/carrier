define([ "modules/moduleRunner/index", "modules/i_ucstyle/index", "modules/i_ucnav/index", "modules/i_ucavatar/index", "modules/header/index", "modules/nav/index", "modules/diamond/index", "modules/sign/index", "modules/golden/index", "modules/i_setphoto/index" ], function(ModuleRunner, i_ucstyle, i_ucnav, i_ucavatar, header, nav, diamond, sign, golden, i_setphoto) {
  var modules = {
    i_ucstyle: i_ucstyle,
    i_ucnav: i_ucnav,
    i_ucavatar: i_ucavatar,
    header: header,
    nav: nav,
    diamond: diamond,
    sign: sign,
    golden: golden,
    i_setphoto: i_setphoto
  };
  ModuleRunner.run(modules);
});