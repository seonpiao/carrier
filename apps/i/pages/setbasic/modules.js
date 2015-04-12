define([ "modules/moduleRunner/index", "modules/i_ucstyle/index", "modules/i_ucnav/index", "modules/i_ucavatar/index", "modules/i_setbasic/index", "modules/header/index", "modules/nav/index", "modules/diamond/index", "modules/sign/index", "modules/golden/index", "modules/i_setphoto/index", "modules/i_setpwd/index" ], function(ModuleRunner, i_ucstyle, i_ucnav, i_ucavatar, i_setbasic, header, nav, diamond, sign, golden, i_setphoto, i_setpwd) {
  var modules = {
    i_ucstyle: i_ucstyle,
    i_ucnav: i_ucnav,
    i_ucavatar: i_ucavatar,
    i_setbasic: i_setbasic,
    header: header,
    nav: nav,
    diamond: diamond,
    sign: sign,
    golden: golden,
    i_setphoto: i_setphoto,
    i_setpwd: i_setpwd
  };
  ModuleRunner.run(modules);
});