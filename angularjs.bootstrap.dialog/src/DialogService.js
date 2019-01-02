/**
 * 对话框服务
 */
(function() {
  var app = angular.module('angularjs.bootstrap.dialog');

  app.factory('DialogService', ['$log', '$timeout', DialogService]);

  function DialogService($log, $timeout) {
    $log.info('DialogService init...');
    var service = {};

    // 通用标题设置
    var dialogTitle = '信息';

    //设置全局标题
    service.setTitle = function(title) {
      dialogTitle = title;
    };

    var tempDialogTitle = null;

    //设置临时标题
    service.setTempTitle = function(title) {
      tempDialogTitle = title;
    };

    /* 确定对话框 ========================================================== */
    var alertBtnOk = '确定';
    var tempAlertBtnOk = null;

    //临时修改alert对话框确定按钮文本
    service.setAlertOk = function(ok) {
      tempAlertBtnOk = ok;
    };

    //alert对话框初始状态
    var alertDialog = {
      closefn: angular.noop,
      hasinit: false
    };

    //初始化alert对话框
    service.setAlertDialog = function(dialog) {
      $log.debug('DialogService.setAlertDialog==>', dialog);
      //alert对话框对应的directive生命周期范围
      alertDialog.scope = dialog.scope;
      //alert对话框元素
      alertDialog.element = dialog.element;
      //关闭事件
      alertDialog.element.on('hidden.bs.modal', function() {
        // 执行并重置回调函数
        var cb = alertDialog.closefn;
        alertDialog.closefn = angular.noop;
        cb();
      });
      alertDialog.hasinit = true;
    };

    //显示alert对话框
    service.showAlert = function(info, cb) {
      if (!alertDialog.hasinit) {
        $log.debug('DialogService.showAlert not init...');
        return;
      }

      $timeout(function() {
        alertDialog.closefn = cb || angular.noop;
        alertDialog.scope.alertInfo = info;
        alertDialog.scope.alertTitle = tempDialogTitle || dialogTitle;
        alertDialog.scope.alertBtnOk = tempAlertBtnOk || alertBtnOk;
        tempDialogTitle = null;
        tempAlertBtnOk = null;
        alertDialog.element.modal('show');
      });
    };

    service.hideAlert = function() {
      alertDialog.element.modal('hide');
    };
    /* ========================================================== */

    /* 等待对话框 ========================================================== */
    var waitDialog = {
      closefn: angular.noop,
      hasinit: false
    };

    service.setWaitDialog = function(dialog) {
      $log.debug('DialogService.setWaitDialog==>', dialog);
      waitDialog.scope = dialog.scope;
      waitDialog.element = dialog.element;
      waitDialog.element.on('hidden.bs.modal', function() {
        // 执行并重置回调函数
        var cb = waitDialog.closefn;
        waitDialog.closefn = angular.noop;
        cb();
      });
      waitDialog.hasinit = true;
    };

    service.showWait = function(info, cb) {
      if (!waitDialog.hasinit) {
        $log.debug('DialogService.showWait not init...');
        return;
      }

      $timeout(function() {
        waitDialog.closefn = cb || angular.noop;
        waitDialog.scope.waitInfo = info;
        waitDialog.scope.waitTitle = tempDialogTitle || dialogTitle;
        tempDialogTitle = null;
        waitDialog.element.modal('show');
      });
    };

    service.hideWait = function() {
      waitDialog.element.modal('hide');
    };
    /* ========================================================== */

    /* 自定义对话框 ========================================================== */

    var confirmBtnYes = '确定';
    var confirmBtnNo = '取消';

    var tempConfirmBtnYes = null;
    var tempConfirmBtnNo = null;

    service.setConfirmYes = function(yes) {
      tempConfirmBtnYes = yes;
    };

    service.setConfirmNo = function(no) {
      tempConfirmBtnNo = no;
    };

    var confirmDialog = {
      yesfn: angular.noop,
      nofn: angular.noop,
      choose: 'no',
      hasinit: false
    };

    service.setConfirmDialog = function(dialog) {
      $log.debug('DialogService.setConfirmDialog==>', dialog);
      confirmDialog.scope = dialog.scope;
      confirmDialog.element = dialog.element;
      confirmDialog.hasinit = true;
    };

    service.showConfirm = function(info, cby, cbn) {
      if (!confirmDialog.hasinit) {
        $log.debug('DialogService.showConfirm not init...');
        return;
      }
      $timeout(function() {
        confirmDialog.yesfn = cby || angular.noop;
        confirmDialog.nofn = cbn || angular.noop;
        confirmDialog.scope.confirmInfo = info;
        confirmDialog.scope.confirmTitle = tempDialogTitle || dialogTitle;
        tempDialogTitle = null;
        alertDialog.scope.confirmBtnYes = tempConfirmBtnYes || confirmBtnYes;
        alertDialog.scope.confirmBtnNo = tempConfirmBtnNo || confirmBtnNo;
        tempConfirmBtnYes = null;
        tempConfirmBtnNo = null;

        confirmDialog.element.on('hidden.bs.modal', function() {
          // 执行并重置回调函数
          var cb = confirmDialog.nofn;
          if (confirmDialog.choose == 'yes') {
            cb = confirmDialog.yesfn;
          }
          confirmDialog.choose = 'no';
          confirmDialog.nofn = angular.noop;
          confirmDialog.yesfn = angular.noop;
          cb();
        });

        confirmDialog.element.modal('show');
      });
    };

    service.hideConfirm = function() {
      confirmDialog.element.modal('hide');
    };

    service.confirmOk = function() {
      confirmDialog.choose = 'yes';
      service.hideConfirm();
    };
    service.confirmCancel = function() {
      confirmDialog.choose = 'no';
      service.hideConfirm();
    };

    /* ========================================================== */

    /* 自定义对话框 ========================================================== */
    var customDialog = {
      closefn: angular.noop,
      hasinit: false,
      data: {}
    };

    service.setCustomDialog = function(dialog) {
      $log.debug('DialogService.setCustomDialog==>', dialog);
      customDialog.scope = dialog.scope;
      customDialog.element = dialog.element;
      customDialog.element.on('hidden.bs.modal', function() {
        var cb = customDialog.closefn;
        customDialog.closefn = angular.noop;
        cb();
      });
      customDialog.hasinit = true;
    };

    service.showCustom = function(page, data, cb) {
      if (!customDialog.hasinit) {
        $log.debug('DialogService.showCustom not init...');
        return;
      }
      $timeout(function() {
        customDialog.scope.customPage = page;
        page = '';
        customDialog.data = data || {};
        customDialog.closefn = cb || angular.noop;
        customDialog.scope.customTitle = tempDialogTitle || dialogTitle;
        tempDialogTitle = null;
        customDialog.element.modal('show');
        $log.debug('showCustomDialog data===>', customDialog.data);
      });
    };

    service.hideCustom = function() {
      customDialog.element.modal('hide');
      $timeout(function() {
        customDialog.scope.customPage = '';
      });
    };

    service.getCustomData = function() {
      $log.debug('getCustomData data===>', customDialog.data);
      var data = customDialog.data;
      $timeout(function() {
        customDialog.data = {};
      });
      return data;
    };
    /* ========================================================== */

    return service;
  }
})();