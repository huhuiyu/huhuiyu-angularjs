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
    'MyLocalDataService',
    function($scope, $log, MyLocalDataService) {
      $log.debug('MyCtrl init...');

      // 处理scope销毁
      $scope.$on('$destroy', function() {
        $log.debug('MyCtrl destroy...');
      });

      $scope.localData = {};

      $scope.save = function() {
        MyLocalDataService.putJson('local.json', $scope.localData);
      };

      $scope.load = function() {
        $scope.localData = MyLocalDataService.getJson('local.json');
      };

      $scope.remove = function() {
        MyLocalDataService.remove('local.json');
        $scope.load();
      };

      $scope.sessionData = {};

      $scope.saveSession = function() {
        MyLocalDataService.putSessionJson('session.json', $scope.sessionData);
      };

      $scope.loadSession = function() {
        $scope.sessionData = MyLocalDataService.getSessionJson('session.json');
      };

      $scope.removesession = function() {
        MyLocalDataService.removeSession('session.json');
        $scope.loadSession();
      };
    }
  ]);

  angular.element(document).ready(function() {
    // 将app绑定给document元素
    angular.bootstrap(document, ['demo']);
  });
})();
