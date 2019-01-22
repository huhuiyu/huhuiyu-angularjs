/**
 * 数据服务
 */
(function () {
  var app = angular.module('angularjs.utils');

  app.factory('MyDataService', ['$log', '$http', 'MyLocalDataService', MyDataService]);

  function MyDataService($log, $http, MyLocalDataService) {
    $log.info('MyDataService init...');
    var errorLocalKey = 'error.local.info';
    //默认错误信息
    var errorInfo = {
      success: false,
      message: '请检查网络状态',
      code: 404
    };

    var service = {
      dataServer: '',
      before: angular.noop,
      after: angular.noop,
      beforeFile: angular.noop,
      afterFile: angular.noop
    };

    service.isJson = function (obj) {
      return obj && typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    };

    //表单参数名称合并
    service.jsonToFlat = function (jsonObj, basename, outObj) {
      if (!outObj) {
        outObj = {};
      }
      for (key in jsonObj) {
        var name = basename && basename.length > 0 ? basename + '.' + key : key;
        var value = jsonObj[key];
        if (!value) {
          continue;
        }
        if (service.isJson(value)) {
          service.jsonToFlat(value, name, outObj);
        } else {
          outObj[name] = value;
          $log.debug(name, value);
        }
      }
      return outObj;
    };

    //设置后台服务器地址
    service.setDataServer = function (dataServer) {
      service.dataServer = dataServer;
    };

    //设置请求前要执行的function
    service.setBefore = function (beforeFn) {
      service.before = beforeFn;
    };

    //设置数据回来后要执行的function
    service.setAfter = function (afterFn) {
      service.after = afterFn;
    };

    //设置上传文件请求前要执行的function
    service.setBeforeFile = function (beforeFn) {
      service.beforeFile = beforeFn;
    };

    //设置上传文件数据回来后要执行的function
    service.setAfterFile = function (afterFn) {
      service.afterFile = afterFn;
    };

    service.send = function (url, postdata, cb) {
      if (!postdata) {
        postdata = {};
      }
      (service.before || angular.noop)(url, postdata);
      $log.debug('发送数据参数：', url, postdata);
      $http({
        method: 'POST',
        url: service.dataServer + url,
        data: postdata
      }).then(
        function (data, status) {
          $log.debug(data, status);
          var after = (service.after || angular.noop)(data);
          $log.debug('after的返回值：', after);
          //返回break表示中断流程
          if (after == 'break') {
            return;
          }
          (cb || angular.noop)(data.data);
        },
        function (data, status) {
          $log.error('处理数据发生错误:', data, status);
          (cb || angular.noop)(errorInfo);
        }
      );
    };

    service.sendFile = function (url, files, postdata, cb) {
      if (!postdata) {
        postdata = {};
      }
      (service.beforeFile || angular.noop)(url, files, postdata);
      $log.debug('文件上传参数：url===>', url, ",files===>", files, ",postdata===>", postdata);
      var form = new FormData();
      //处理表单参数
      postdata = service.jsonToFlat(postdata, '');
      for (key in postdata) {
        form.append(key, postdata[key]);
      }
      //处理文件信息(格式为上传文件的key（只能有一个）,值是文件数组{uploadkey:[file0,file1,...]})
      for (key in files) {
        var filelist = files[key];
        for (var i = 0; i < filelist.length; i++) {
          form.append(key, filelist[i]);
        }
      }
      //上传文件
      $http({
        method: 'POST',
        url: service.dataServer + url,
        data: form,
        headers: {
          'Content-Type': undefined
        },
        transformRequest: angular.identity
      }).then(
        function (data, status) {
          $log.debug(data, status);
          var after = (service.afterFile || angular.noop)(data);
          $log.debug('after的返回值：', after);
          //返回break表示中断流程
          if (after == 'break') {
            return;
          }
          (cb || angular.noop)(data.data);
        },
        function (data, status) {
          $log.error('处理数据发生错误:', data, status);
          MyLocalDataService.putJson(errorLocalKey, {
            data: data,
            status: status
          });
          (cb || angular.noop)(errorInfo);
        }
      );
    };

    service.loadLastError = function () {
      return MyLocalDataService.getJson(errorLocalKey);
    };

    service.get = function (url, cb) {
      $http({
        method: 'GET',
        url: url
      }).then(
        function (data, status) {
          $log.info(data, '====>', status);
          (cb || angular.noop)(null, data.data);
        },
        function (data, status) {
          $log.error(data, status);
          (cb || angular.noop)(data, null);
        }
      );
    };

    service.post = function (url, postdata, cb) {
      $http({
        method: 'POST',
        url: url,
        data: postdata
      }).then(
        function (data, status) {
          $log.debug(data, status);
          (cb || angular.noop)(null, data.data);
        },
        function (data, status) {
          $log.error(data, status);
          (cb || angular.noop)(data, null);
        }
      );
    };

    return service;
  }
})();