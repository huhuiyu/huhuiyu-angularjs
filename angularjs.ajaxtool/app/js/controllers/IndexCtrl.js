(function() {
  var ctrls = angular.module(MyAppConfig.controllers);
  ctrls.controller('IndexCtrl', ['$scope', '$timeout', '$log', 'MyDataService', 'DialogService', 'MyUtilService', IndexCtrl]);

  function IndexCtrl($scope, $timeout, $log, MyDataService, DialogService, MyUtilService) {
    $log.debug('IndexCtrl init...');

    // 处理scope销毁
    $scope.$on('$destroy', function() {
      $log.debug('IndexCtrl destroy...');
    });

    $scope.config = {
      server: 'http://127.0.0.1:20000',
      url: '/',
      params: '{"echo":"哈哈"}'
    };
    $scope.result = '';
    $scope.link = '';

    $scope.test = function() {
      DialogService.showWait('测试中...');
      try {
        MyDataService.setDataServer($scope.config.server);
        var jsonData = JSON.parse($scope.config.params);
        console.log('ahaha', jsonData);
        $scope.link = $scope.config.server + '?' + MyUtilService.jsonToDeeplink(MyDataService.jsonToFlat(jsonData));
        MyDataService.send($scope.config.url, jsonData, function(data) {
          DialogService.hideWait();
          $scope.result = MyUtilService.trustAsHtml(MyUtilService.formatJson(data, true));
        });
      } catch (ex) {
        $scope.showError(ex);
      }
    };

    $scope.showError = function(ex) {
      $scope.result = ex;
      $timeout(function() {
        DialogService.hideWait();
      }, 1);
    };
  }
})();
