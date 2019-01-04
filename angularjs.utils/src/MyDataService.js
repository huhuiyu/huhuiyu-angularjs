/**
 * 数据服务
 */
(function () {
  var app = angular.module('angularjs.utils');

  app.factory('MyDataService', [
    '$log',
    '$http',
    MyDataService
  ]);

  function MyDataService(
    $log,
    $http
  ) {
    $log.info('MyDataService init...');
    //默认错误信息
    var errorInfo = {
      success: false,
      message: '请检查网络状态',
      code: 404
    };

    var service = {
      dataServer: '',
      before: angular.noop,
      after: angular.noop
    };

    //设置后台服务器地址
    service.setDataServer = function (dataServer) {
      service.dataServer = dataServer;
    };

    //设置请求前要执行的function
    service.setBefore = function (beforeFn) {
      service.before = beforeFn;
    };

    //设置数据回来后要执行的function
    service.setAfter = function (afterFn) {
      service.after = afterFn;
    };

    service.send = function (url, postdata, cb) {
      if (!postdata) {
        postdata = {};
      }
      (service.before || angular.noop)(url, postdata);
      $http({
        method: 'POST',
        url: service.dataServer + url,
        data: postdata
      }).then(
        function (data, status) {
          $log.debug(data, status);
          var after = (service.after || angular.noop)(data);
          $log.debug('after的返回值：', after);
          //返回break表示中断流程
          if (after == 'break') {
            return;
          }
          (cb || angular.noop)(data.data);
        },
        function (data, status) {
          $log.error('处理数据发生错误:', data, status);
          (cb || angular.noop)(errorInfo);
        }
      );
    };

    service.get = function (url, cb) {
      $http({
        method: 'GET',
        url: url
      }).then(
        function (data, status) {
          $log.info(data, '====>', status);
          (cb || angular.noop)(null, data.data);
        },
        function (data, status) {
          $log.error(data, status);
          (cb || angular.noop)(data, null);
        }
      );
    };

    service.post = function (url, postdata, cb) {
      $http({
        method: 'POST',
        url: url,
        data: postdata
      }).then(
        function (data, status) {
          $log.debug(data, status);
          (cb || angular.noop)(null, data.data);
        },
        function (data, status) {
          $log.error(data, status);
          (cb || angular.noop)(data, null);
        }
      );
    };

    return service;
  }
})();