/**
 * 日期服务
 */
(function () {
  var app = angular.module('angularjs.utils');
  // 创建cookie服务
  app.factory('MyDateService', ['$log', MyDateService]);

  var weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  function MyDateService($log) {
    $log.info('MyDateService init...');
    // 服务对象
    var service = {};

    service.formatDate = function (timestamp, format) {
      var date = new Date();
      if (timestamp) {
        date.setTime(timestamp);
      }
      if (!format) {
        // 默认格式
        format = 'y-M-d h:m:s';
      }
      var year = date.getFullYear() + '';
      var month = date.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      var day = date.getDate();
      day = day < 10 ? '0' + day : day;
      var hour = date.getHours();
      hour = hour < 10 ? '0' + hour : hour + '';
      var minute = date.getMinutes();
      minute = minute < 10 ? '0' + minute : minute + '';
      var seconds = date.getSeconds();
      seconds = seconds < 10 ? '0' + seconds : seconds + '';
      var result = format.replace(/y/g, year);
      result = result.replace(/M/g, month);
      result = result.replace(/d/g, day);
      result = result.replace(/h/g, hour);
      result = result.replace(/m/g, minute);
      result = result.replace(/s/g, seconds);
      result = result.replace(/w/g, weekNames[date.getDay()]);
      return result;
    };

    return service;
  }
})();