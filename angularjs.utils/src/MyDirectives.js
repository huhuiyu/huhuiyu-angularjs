(function () {
  var app = angular.module('angularjs.utils');

  app.directive('focusOn', [
    '$log',
    function ($log) {
      $log.debug('directive focus-on...');
      return {
        scope: {
          focusOn: '@'
        },
        link: function ($scope, element, attr) {
          $log.debug('directive focus-on element:', element, attr);

          var watch = $scope.$watch('focusOn', function (nv, ov) {
            $log.debug('directive focus-on watch:', nv, ov);
            if (nv == true || nv == 'true') {
              try {
                element[0].focus();
              } catch (e) {
                $log.debug('directive focus error:', e);
              }
            }
          });

          $scope.$on('$destroy', function () {
            $log.debug('directive focus-on destroy...');
            if (!finish) {
              watch();
            }
          });
        }
      };
    }
  ]);

  /**
   * 按照指定给是显示时间戳的指令
   */
  app.directive('showTime', [
    '$log',
    'MyUtilService',
    'MyDateService',
    function ($log, MyUtilService, MyDateService) {
      $log.debug('directive show-time...');
      return {
        scope: {
          showTime: '@'
        },
        link: function ($scope, element, attr) {
          $log.debug('directive show-time element:', element, attr);
          var format = element.attr('show-time-format');
          var needwatch = element.attr('show-time-watch');
          if (MyUtilService.empty(format)) {
            format = 'y-M-d';
          }
          var finish = false;
          var watch = $scope.$watch('showTime', function (nv, ov) {
            $log.debug('directive show-time watch:', nv, ov);
            if (nv && nv !== '') {
              try {
                var time = parseInt(nv);
                element.html(MyDateService.formatDate(time, format));
              } catch (e) {
                $log.debug('directive show-time error:', e);
              }
              if (needwatch != 'watch') {
                watch();
                finish = true;
              }
            }
          });

          $scope.$on('$destroy', function () {
            $log.debug('directive show-time destroy...');
            if (!finish) {
              watch();
            }
          });
        }
      };
    }
  ]);

  /**
   * 处理fixed效果的指令
   */
  app.directive('fixedTop', [
    '$log',
    function ($log) {
      $log.debug('directive fixed-top...');
      return {
        link: function ($scope, element, attr) {
          $log.debug('directive fixed-top element:', element, attr);
          var height = element.height();
          $log.debug('directive fixed-top height:', height);
          angular.element(element[0].nextElementSibling).css('margin-top', height + 'px');

          $scope.$on('$destroy', function () {
            $log.debug('directive fixed-top destroy...');
          });
        }
      };
    }
  ]);

  app.directive('fixedBottom', [
    '$log',
    function ($log) {
      $log.debug('directive fixed-bottom...');
      return {
        link: function ($scope, element, attr) {
          $log.debug('directive fixed-bottom element:', element);
          var height = element.height();
          $log.debug('directive fixed-bottom height:', height);
          angular.element(element[0].previousElementSibling).css('margin-bottom', height + 'px');

          $scope.$on('$destroy', function () {
            $log.debug('directive fixed-bottom destroy...');
          });
        }
      };
    }
  ]);

  /**
   * 高度填充到下一个元素
   */
  app.directive('fixedToNext', [
    '$log',
    function ($log) {
      $log.debug('directive fixed-to-next...');
      return {
        link: function ($scope, element, attr) {
          $log.debug('directive fixed-to-next element:', element, attr);
          var mytop = element.offset().top;
          var nexttop = angular.element(element[0].nextElementSibling).offset().top;
          element.height(nexttop - mytop);
          $log.debug('directive fixed-to-next top:', mytop, nexttop);
          $scope.$on('$destroy', function () {
            $log.debug('directive fixed-to-next destroy...');
          });
        }
      };
    }
  ]);


})();