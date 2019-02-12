(function(win) {
  //基本配置
  win.MyAppConfig = {
    name: 'myapp',
    title: 'huhuiyu-ng-app',
    services: 'services',
    controllers: 'controllers',
    directives: 'directives',
    dataservice: 'http://myoss.huhuiyu.top/dataservice',
    debug: true
  };

  // 初始化控制器，服务，指令三大模块
  angular.module(MyAppConfig.controllers, []);
  angular.module(MyAppConfig.services, []);
  angular.module(MyAppConfig.directives, []);

  //第一个myapp的模块，引用controllers模块
  var app = angular.module(MyAppConfig.name, ['ngRoute', 'ngCookies', 'ngSanitize', 'ngAnimate', 'ngMessages', 'angularjs.bootstrap.dialog', 'angularjs.utils', MyAppConfig.controllers, MyAppConfig.services, MyAppConfig.directives]);

  //配置日志是否开启debug
  app.config([
    '$logProvider',
    function($logProvider) {
      $logProvider.debugEnabled(MyAppConfig.debug);
    }
  ]);

  // 处理ajax请求
  app.config([
    '$httpProvider',
    function($httpProvider) {
      /* 请求错误统一跳转到错误页面 */
      $httpProvider.interceptors.push([
        '$q',
        '$log',
        '$location',
        function($q, $log, $location) {
          return {
            responseError: function(rejection) {
              $log.debug('应答发生错误：', rejection);
              if (rejection.config.url.substr(0, 9) == 'templates') {
                $log.debug('模板页不存在==>', rejection.config.url);
                $location.path('/route/page/404'); // 找不到模板转到首页，也可以跳转到统一的404错误页
              }
              return $q.reject(rejection);
            }
          };
        }
      ]);
    }
  ]);

  // 配置路由
  app.config([
    '$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('', {
          templateUrl: 'templates/index.html'
        })
        .when('/', {
          templateUrl: 'templates/index.html'
        })
        .when('/index', {
          templateUrl: 'templates/index.html'
        })
        .when('/route/:path*', {
          templateUrl: 'templates/route.html'
        })
        .otherwise({
          templateUrl: 'templates/index.html'
        });
    }
  ]);
})(window);
