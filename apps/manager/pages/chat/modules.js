define([ "modules/moduleRunner/index", "modules/mm_chat/multi", "modules/managerChat/index" ], function(ModuleRunner, mm_chatMulti, managerChat) {
  var modules = {
    mm_chatMulti: mm_chatMulti,
    managerChat: managerChat
  };
  ModuleRunner.run(modules);
});