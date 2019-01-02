(function () {
  // 定义应用程序和依赖模块
  angular.module('angularjs.utils', ['ngSanitize']);
  var app = angular.module('angularjs.utils');

  // 处理ajax请求
  app.config([
    '$httpProvider',
    function ($httpProvider) {
      /* post提交可以使用json数据 */
      $httpProvider.defaults.headers.post['Content-Type'] =
        'application/x-www-form-urlencoded;charset=utf-8';
      var parseParams = function (params) {
        // 参数处理
        var query = '',
          name,
          value,
          fullSubName,
          subName,
          subValue,
          innerObj,
          i;
        for (name in params) {
          value = params[name];
          if (value instanceof Array) {
            for (i = 0; i < value.length; i++) {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += parseParams(innerObj) + '&';
            }
          } else if (value instanceof Object) {
            for (subName in value) {
              subValue = value[subName];
              fullSubName = name + '.' + subName;
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += parseParams(innerObj) + '&';
            }
          } else if (value !== undefined && value !== null) {
            query +=
              encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
          }
        }
        var querydata = query;
        if (query.length) {
          querydata = query.substr(0, query.length - 1);
        }
        return querydata;
      };

      $httpProvider.defaults.transformRequest = [
        function (data) {
          var formdata = data;
          if (angular.isObject(data) && String(data) !== '[object File]') {
            formdata = parseParams(data);
          }
          return formdata;
        }
      ];
    }
  ]);
})();