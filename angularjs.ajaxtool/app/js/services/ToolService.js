/**
 * 工具服务
 */
(function() {
  var app = angular.module(MyAppConfig.services);

  app.factory('ToolService', ['$log', '$rootScope', 'MyDataService', 'MyLocalDataService', 'DialogService', 'MyUtilService', ToolService]);

  function ToolService($log, $rootScope, MyDataService, MyLocalDataService, DialogService, MyUtilService) {
    $log.info('ToolService init...');
    var service = {};

    var servertokenKey = 'servertoken.key';

    DialogService.setTitle($rootScope.appTitle);

    service.initDataService = function() {
      MyDataService.setDataServer(MyAppConfig.dataservice);
      $log.debug('dataserver=====>', MyDataService.getDataServer());

      function beforeSend(url, senddata) {
        $log.debug('before:', url, senddata);
        // 发送时间戳和token
        senddata.ajaxtimestamp = new Date().getTime();
        senddata.token = MyLocalDataService.get(servertokenKey);
      }

      function beforeSendFile(url, files, senddata) {
        $log.debug('before:File', url, files, senddata);
        // 发送时间戳和token
        senddata.ajaxtimestamp = new Date().getTime();
        senddata.token = MyLocalDataService.get(servertokenKey);
      }

      function afterSend(data) {
        $log.debug('after data====>', data);
        //保存token
        if (data.data && data.data.token && !MyUtilService.empty(MyUtilService.trim(data.data.token))) {
          MyLocalDataService.put(servertokenKey, data.data.token);
        }
      }

      MyDataService.setBefore(beforeSend);
      MyDataService.setBeforeFile(beforeSendFile);
      MyDataService.setAfter(afterSend);
      MyDataService.setAfterFile(afterSend);
    };

    service.getServerToken = function() {
      return MyLocalDataService.get(servertokenKey);
    };

    return service;
  }
})();
