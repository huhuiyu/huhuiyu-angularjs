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
    '$interval',
    function ($scope, $log, $interval) {
      $log.debug('MyCtrl init...', $scope);

      // 处理scope销毁
      $scope.$on('$destroy', function () {
        $log.debug('MyCtrl destroy...');
        if (timer) {
          $interval.cancel(timertimer);
        }
      });
      $scope.now = new Date().getTime();

      var timer = $interval(function () {
        $scope.now = new Date().getTime();
      }, 1000);
    }
  ]);

  angular.element(document).ready(function () {
    // 将app绑定给document元素
    angular.bootstrap(document, ['demo']);
  });
})();