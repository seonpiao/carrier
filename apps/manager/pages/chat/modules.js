define([ "modules/moduleRunner/index", "modules/mm_chat/multi", "modules/managerChat/index" ], function(ModuleRunner, mm_chatmulti, managerChat) {
  var modules = {
    mm_chatmulti: mm_chatmulti,
    managerChat: managerChat
  };
  ModuleRunner.run(modules);
});