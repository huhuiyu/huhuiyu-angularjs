(function() {
  var ctrls = angular.module(MyAppConfig.controllers);
  ctrls.controller('IndexCtrl', ['$scope', '$log', 'MyDataService', 'DialogService', 'MyUtilService', 'ToolService', IndexCtrl]);

  function IndexCtrl($scope, $log, MyDataService, DialogService, MyUtilService, ToolService) {
    $log.debug('IndexCtrl init...');

    // 处理scope销毁
    $scope.$on('$destroy', function() {
      $log.debug('IndexCtrl destroy...');
    });

    DialogService.showWait('获取后台数据中...');
    MyDataService.send('/', {}, function(data) {
      DialogService.hideWait();
      $log.debug(data);
      $scope.data = MyUtilService.trustAsHtml(MyUtilService.formatJson(data, true));
      $log.debug(ToolService.getServerToken());
    });
  }
})();
