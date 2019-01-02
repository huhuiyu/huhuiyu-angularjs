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
    'MyDateService',
    function ($scope, $log, MyDateService) {
      $log.debug('MyCtrl init...', $scope);

      // 处理scope销毁
      $scope.$on('$destroy', function () {
        $log.debug('MyCtrl destroy...');
      });

      $scope.date01 = MyDateService.formatDate(new Date().getTime(), 'y-M-d y-M-d h:m:s h:m:s w');

    }
  ]);

  angular.element(document).ready(function () {
    // 将app绑定给document元素
    angular.bootstrap(document, ['demo']);
  });
})();