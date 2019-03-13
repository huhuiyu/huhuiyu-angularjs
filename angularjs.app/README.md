# angularjs 基础项目

- 首先是复制一份项目出来
- 先决条件
  - 需要安装`nodejs`
  - 需要全局安装`gulp`
  - 最好安装过`cnpm`，否则下面的`cnpm`都要替换成`npm`
- 执行`cnpm intall`安装项目依赖插件
- 执行`gulp`初始化项目
- 在`nginx`目录中创建`logs`和`temp`目录
- 复制`nginx-path.conf.bat`文件，命名为`nginx-path.bat`，修改里面的路径为正确路径
- 复制`browser.conf.js`文件，命名为`browser.js`，修改里面的路径为正确路径
- 修改`package.json`中项目相关信息
- 开发脚本
  - 执行`app-dev.bat`启动开发模式
  - 执行`nginx-start.bat`启动 nginx 服务
  - 执行`browser.bat`启动浏览器
  - 执行`nginx-stop.bat`关闭 nginx 服务
