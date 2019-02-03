//空白directive
(function() {
  var app = angular.module(MyAppConfig.directives);

  app.directive('blank', [
    '$log',
    'BlankService',
    function($log, BlankService) {
      $log.debug('directive blank...');

      return {
        restrict: 'AE',
        template: '<span ng-bind="test"></span>',
        replace: true,
        link: function($scope, element, attr) {
          $scope.$on('$destroy', function() {
            $log.debug('directive blank destroy...');
          });

          $log.debug('directive blank init...', element, attr);
          $scope.test = BlankService.test();
        }
      };
    }
  ]);
})();
