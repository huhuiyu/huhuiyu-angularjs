(function () {
  var app = angular.module('demo', ['ngSanitize', 'angularjs.utils']);

  app.config([
    '$logProvider',
    function ($logProvider) {
      $logProvider.debugEnabled(true);
    }
  ]);

  app.controller('MyCtrl', ['$scope', '$log', '$timeout', 'MyUtilService', function ($scope, $log, $timeout, MyUtilService) {
    $log.debug('MyCtrl init...', $scope);

    // 处理scope销毁
    $scope.$on('$destroy', function () {
      $log.debug('MyCtrl destroy...');
    });

    $scope.demo = {};

    $scope.md5 = function () {
      $scope.demo.md5result = MyUtilService.md5($scope.demo.md5data);
    };

    $scope.trimResult = function () {
      return MyUtilService.trim($scope.demo.trimData);
    };

    $scope.isEmpty = function () {
      return MyUtilService.empty($scope.demo.trimData);
    };

    $scope.showHtmlData = function () {
      return MyUtilService.trustAsHtml($scope.htmldata);
    };

    $scope.isPhone = MyUtilService.isMobile();
    $scope.browserInfo = MyUtilService.trustAsHtml(MyUtilService.formatJson(MyUtilService.getBrowserInfo(), true));

    $scope.uuid01 = MyUtilService.getUuid();
    $scope.uuid02 = MyUtilService.getUuid32();


    $scope.focus = {
      one: true,
      two: false
    };

    $timeout(function () {
      $scope.focus.two = true;
    }, 2000);
  }]);

  angular.element(document).ready(function () {
    // 将app绑定给document元素
    angular.bootstrap(document, ['demo']);
  });
})();