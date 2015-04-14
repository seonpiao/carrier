define([ "modules/moduleRunner/index", "modules/i_base/index" ], function(ModuleRunner, i_base) {
  var modules = {
    i_base: i_base
  };
  ModuleRunner.run(modules);
});