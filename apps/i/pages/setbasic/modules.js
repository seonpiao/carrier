define([ "modules/moduleRunner/index", "modules/i_ucstyle/index", "modules/i_ucnav/index" ], function(ModuleRunner, i_ucstyle, i_ucnav) {
  var modules = {
    i_ucstyle: i_ucstyle,
    i_ucnav: i_ucnav
  };
  ModuleRunner.run(modules);
});