/**
 * 本地数据存储服务
 */
(function() {
  var app = angular.module('angularjs.utils');
  // 创建cookie服务
  app.factory('MyLocalDataService', ['$log', MyLocalDataService]);

  function MyLocalDataService($log) {
    $log.info('MyLocalDataService init...');
    // 服务对象
    var service = {};
    //本地存储部分===========================================================================
    //放置本地储存
    service.put = function(key, value) {
      $log.debug('MyLocalDataService.put ', key, value);
      localStorage.setItem(key, value);
    };

    //获取本地存储
    service.get = function(key) {
      $log.debug('MyLocalDataService.get ', key);
      return localStorage.getItem(key);
    };

    //删除本地存储
    service.remove = function(key) {
      $log.debug('MyLocalDataService.remove ', key);
      localStorage.removeItem(key);
    };

    //放置json数据
    service.putJson = function(key, json) {
      try {
        service.put(key, JSON.stringify(json));
      } catch (ex) {
        $log.debug('MyLocalDataService putJson ex;', ex.message);
      }
    };

    //获取json数据
    service.getJson = function(key) {
      var value = service.get(key) || '';
      if (value === '') {
        // 没有数据就直接返回
        return value;
      }
      try {
        return JSON.parse(value);
      } catch (ex) {
        $log.debug('MyLocalDataService getJson ex;', ex.message);
        return '';
      }
    };

    //本地会话部分=========================================================================================

    //放置本地会话
    service.putSession = function(key, value) {
      $log.debug('MyLocalDataService.putSession ', key, value);
      sessionStorage.setItem(key, value);
    };

    //获取本地会话
    service.getSession = function(key) {
      $log.debug('MyLocalDataService.getSession ', key);
      return sessionStorage.getItem(key);
    };

    //删除本地会话
    service.removeSession = function(key) {
      $log.debug('MyLocalDataService.removeSession ', key);
      sessionStorage.removeItem(key);
    };

    //放置json数据
    service.putSessionJson = function(key, json) {
      try {
        service.putSession(key, JSON.stringify(json));
      } catch (ex) {
        $log.debug('MyLocalDataService putSessionJson ex;', ex.message);
      }
    };

    //获取json数据
    service.getSessionJson = function(key) {
      var value = service.getSession(key) || '';
      if (value === '') {
        // 没有数据就直接返回
        return {};
      }
      try {
        return JSON.parse(value);
      } catch (ex) {
        $log.debug('MyLocalDataService getSessionJson ex;', ex.message);
        return {};
      }
    };

    return service;
  }
})();
