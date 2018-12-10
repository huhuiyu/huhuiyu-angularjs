(function() {
  var app = angular.module('demo', ['angularjs.bootstrap.dialog']);

  app.controller('IndexCtrl', [
    '$scope',
    '$log',
    '$timeout',
    'DialogService',
    function($scope, $log, $timeout, DialogService) {
      $log.debug('IndexCtrl init...');

      DialogService.setTitle('对话框演示');

      // 处理scope销毁
      $scope.$on('$destroy', function() {
        $log.debug('IndexCtrl destroy...');
      });

      $scope.showAlert = function() {
        DialogService.setTempTitle('标题');
        DialogService.setAlertOk('按钮');

        DialogService.showAlert('哈哈哈<br>呵呵呵', function() {
          DialogService.showAlert('嘻嘻嘻');
        });
      };

      $scope.showWait = function() {
        DialogService.showWait('哈哈哈', function() {
          DialogService.showAlert('嘻嘻嘻');
        });

        $timeout(DialogService.hideWait, 5000);
      };

      $scope.showCustom = function() {
        DialogService.setTempTitle('自定义对话框');

        DialogService.showCustom(
          'dialoginc.html',
          {
            info: '嘻嘻嘻'
          },
          function() {
            DialogService.showConfirm('是否继续？');
          }
        );
      };

      $scope.showConfirm = function() {
        DialogService.setTempTitle('自定义对话框');
        DialogService.setConfirmYes('yes');
        DialogService.setConfirmNo('no');

        DialogService.showConfirm(
          '是否继续？',
          function() {
            DialogService.showAlert('确定');
          },
          function() {
            DialogService.showAlert('取消');
          }
        );
      };
    }
  ]);

  app.controller('DialogIncCtrl', [
    '$scope',
    '$log',
    'DialogService',
    function($scope, $log, DialogService) {
      $log.debug('DialogIncCtrl init...');

      // 处理scope销毁
      $scope.$on('$destroy', function() {
        $log.debug('DialogIncCtrl destroy...');
      });

      $scope.data = DialogService.getCustomData();

      $scope.closeMe = function() {
        DialogService.hideCustom();
      };
    }
  ]);

  angular.element(document).ready(function() {
    // 将app绑定给document元素
    angular.bootstrap(document, ['demo']);
  });
})();
