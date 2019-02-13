/**
 * 空白服务
 */
(function() {
  var app = angular.module(MyAppConfig.services);

  app.factory('BlankService', ['$log', BlankService]);

  function BlankService($log) {
    $log.info('BlankService init...');
    var service = {};

    service.test = function() {
      return '测试服务';
    };

    return service;
  }
})();
