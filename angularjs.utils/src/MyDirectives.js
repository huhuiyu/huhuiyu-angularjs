(function() {
  var app = angular.module('angularjs.utils');

  //设置焦点元素
  app.directive('focusOn', [
    '$log',
    function($log) {
      $log.debug('directive focus-on...');
      return {
        scope: {
          focusOn: '@'
        },
        link: function($scope, element, attr) {
          $log.debug('directive focus-on element:', element, attr);

          var watch = $scope.$watch('focusOn', function(nv, ov) {
            $log.debug('directive focus-on watch:', nv, ov);
            if (nv == true || nv == 'true') {
              try {
                element[0].focus();
              } catch (e) {
                $log.debug('directive focus error:', e);
              }
            }
          });

          $scope.$on('$destroy', function() {
            $log.debug('directive focus-on destroy...');
            watch();
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
    function($log, MyUtilService, MyDateService) {
      $log.debug('directive show-time...');
      return {
        scope: {
          showTime: '@'
        },
        link: function($scope, element, attr) {
          $log.debug('directive show-time element:', element, attr);
          var format = element.attr('show-time-format');
          var needwatch = element.attr('show-time-watch');
          if (MyUtilService.empty(format)) {
            format = 'y-M-d';
          }
          var finish = false;
          var watch = $scope.$watch('showTime', function(nv, ov) {
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

          $scope.$on('$destroy', function() {
            $log.debug('directive show-time destroy...');
            if (!finish) {
              watch();
            }
          });
        }
      };
    }
  ]);

  var maxFixedCount = 20;

  /**
   * 处理fixed效果的指令
   */
  app.directive('fixedTop', [
    '$log',
    '$interval',
    function($log, $interval) {
      $log.debug('directive fixed-top...');
      return {
        link: function($scope, element, attr) {
          var count = 0;
          function watchTopHeight() {
            $log.debug('directive fixed-top element:', element, attr);
            var height = element.height();
            $log.debug('directive fixed-top height:', height);
            angular.element(element[0].nextElementSibling).css('margin-top', height + 'px');
            count++;
            if (count >= maxFixedCount - 1) {
              $interval.cancel(timer);
              timer = null;
            }
          }
          watchTopHeight();
          var timer = $interval(watchTopHeight, 1000);

          $scope.$on('$destroy', function() {
            if (timer) {
              $interval.cancel(timer);
            }
            $log.debug('directive fixed-top destroy...');
          });
        }
      };
    }
  ]);

  app.directive('fixedBottom', [
    '$log',
    '$interval',
    function($log, $interval) {
      $log.debug('directive fixed-bottom...');
      return {
        link: function($scope, element, attr) {
          var count = 0;

          function watchBottomHeight() {
            $log.debug('directive fixed-bottom element:', element);
            var height = element.height();
            $log.debug('directive fixed-bottom height:', height);
            angular.element(element[0].previousElementSibling).css('margin-bottom', height + 'px');
            count++;
            if (count >= maxFixedCount - 1) {
              $interval.cancel(timer);
              timer = null;
            }
          }

          watchBottomHeight();

          var timer = $interval(watchBottomHeight, 1000);

          $scope.$on('$destroy', function() {
            if (timer) {
              $interval.cancel(timer);
            }
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
    '$interval',
    function($log, $interval) {
      $log.debug('directive fixed-to-next...');
      return {
        link: function($scope, element, attr) {
          var count = 0;

          function watchNextHeight() {
            $log.debug('directive fixed-to-next element:', element, attr);
            var mytop = element.offset().top;
            var nexttop = angular.element(element[0].nextElementSibling).offset().top;
            // var eleStyle = getComputedStyle(element[0], null);
            // var marginTop = eleStyle.getPropertyValue('margin-top').replace(/[^0-9.]/g, '');
            // var marginBottom = eleStyle.getPropertyValue('margin-bottom').replace(/[^0-9.]/g, '');
            var marginTop = 0;
            var marginBottom = 0;
            var minHeight = nexttop - mytop - marginTop - marginBottom;
            element.css('min-height', minHeight + 'px');
            $log.debug('directive fixed-to-next top:', mytop, nexttop, marginTop, marginBottom, minHeight);
            count++;
            if (count > maxFixedCount) {
              $interval.cancel(timer);
              timer = null;
            }
          }
          watchNextHeight();
          var timer = $interval(watchNextHeight, 1000);

          $scope.$on('$destroy', function() {
            if (timer) {
              $interval.cancel(timer);
            }
            $log.debug('directive fixed-to-next destroy...');
          });
        }
      };
    }
  ]);
})();
