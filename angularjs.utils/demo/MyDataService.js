(function () {
  var app = angular.module('demo', ['angularjs.utils']);

  app.config([
    '$logProvider',
    function ($logProvider) {
      $logProvider.debugEnabled(true);
    }
  ]);

  app.controller('MyCtrl', [
    '$scope',
    '$log',
    'MyDataService',
    'MyUtilService',
    function ($scope, $log, MyDataService, MyUtilService) {
      $log.debug('MyCtrl init...', $scope);

      // 处理scope销毁
      $scope.$on('$destroy', function () {
        $log.debug('MyCtrl destroy...');
      });

      MyDataService.setDataServer('http://test.huhuiyu.top');
      MyDataService.setBefore(function (url, senddata) {
        $log.debug('统一前置执行方法：', url, senddata);
      });

      MyDataService.setAfter(function (data) {
        $log.debug('统一后置执行方法：', data);
      });

      MyDataService.send('/', {
        'test': {
          'tid': 100,
          'tinfo': '测试信息' + Math.random(),
          'tdate': '2019-01-02'
        }
      }, function (data) {
        $scope.result = MyUtilService.trustAsHtml(MyUtilService.formatJson(data, true));
      });

    }
  ]);

  angular.element(document).ready(function () {
    // 将app绑定给document元素
    angular.bootstrap(document, ['demo']);
  });
})();