define([ "modules/moduleRunner/index", "modules/mm_chat/multi", "modules/managerChat/index" ], function(ModuleRunner, mm_chatMulti, managerChat) {
  var modules = {
    managerChat: managerChat,
    mm_chatMulti: mm_chatMulti
  };
  ModuleRunner.run(modules);
});