(function() {
  var app = angular.module('demo', ['angularjs.utils']);

  app.config([
    '$logProvider',
    function($logProvider) {
      $logProvider.debugEnabled(true);
    }
  ]);

  app.controller('MyCtrl', [
    '$scope',
    '$log',
    'MyUtilService',
    function($scope, $log, MyUtilService) {
      $log.debug('MyCtrl init...');

      // 处理scope销毁
      $scope.$on('$destroy', function() {
        $log.debug('MyCtrl destroy...');
      });

      $scope.demo = {};

      $scope.md5 = function() {
        $scope.demo.md5result = MyUtilService.md5($scope.demo.md5data);
      };

      
    }
  ]);

  angular.element(document).ready(function() {
    // 将app绑定给document元素
    angular.bootstrap(document, ['demo']);
  });
})();
