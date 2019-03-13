const gulp = require('gulp');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const mincss = require('gulp-clean-css');
const del = require('del');
const sync = require('gulp-file-sync');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');
const appconfig = require('./config.json');
//应用程序根目录
const baseDir = __dirname.replace(/[\\]/g, '/') + '/';
//是否包含test目录
var includeTest = true;

/*公用方法=============================================================================*/
function clearBuild(config) {
  console.log('清除目录:', baseDir + config.dist);
  del.sync([baseDir + config.dist + '**/*'], {
    force: true
  });
}

function libsBuild(config) {
  console.log(baseDir + config.libs, baseDir + config.distlibs);
  sync(baseDir + config.libs, baseDir + config.distlibs);
}

function jslibBuild(config) {
  var libs = [];
  libs.push(baseDir + appconfig.common.nodemodules + 'jquery/dist/jquery.min.js');
  libs.push(baseDir + appconfig.common.nodemodules + 'bootstrap3/dist/js/bootstrap.min.js');
  libs.push(baseDir + appconfig.common.nodemodules + 'angular/angular.min.js');
  libs.push(baseDir + appconfig.common.nodemodules + 'angular-route/angular-route.min.js');
  libs.push(baseDir + appconfig.common.nodemodules + 'angular-sanitize/angular-sanitize.min.js');
  libs.push(baseDir + appconfig.common.nodemodules + 'angular-animate/angular-animate.min.js');
  libs.push(baseDir + appconfig.common.nodemodules + 'angular-cookies/angular-cookies.min.js');
  libs.push(baseDir + appconfig.common.nodemodules + 'angular-messages/angular-messages.min.js');

  return gulp
    .src(libs)
    .pipe(concat('lib.min.js'))
    .pipe(gulp.dest(baseDir + config.distjs));
}

function csslibBuild(config) {
  var libs = [];
  libs.push(baseDir + appconfig.common.nodemodules + 'bootstrap3/dist/css/bootstrap.min.css');
  return gulp
    .src(libs)
    .pipe(concat('lib.min.css'))
    .pipe(gulp.dest(baseDir + config.distcss));
}

function fontsBuild(config) {
  //gulp-file-sync插件是同步文件
  sync(baseDir + appconfig.common.nodemodules + 'bootstrap3/dist/fonts/', baseDir + config.distfonts);
}

function htmlBuild(config) {
  sync(baseDir + config.templates, baseDir + config.disttemplates);
  gulp.src([baseDir + config.html + 'index.html']).pipe(gulp.dest(baseDir + config.dist));
  if (!includeTest) {
    del.sync(baseDir + config.disttemplates + 'test/');
  }
}

function imagesBuild(config) {
  sync(baseDir + config.images, baseDir + config.distimages);
  if (!includeTest) {
    del.sync(baseDir + config.distimages + 'test/');
  }
}

function jsBuild(config) {
  var jsfiles = [];
  jsfiles.push(baseDir + config.js + 'config.js');
  jsfiles.push(baseDir + config.js + 'services/**/*.js');
  jsfiles.push(baseDir + config.js + 'directives/**/*.js');
  jsfiles.push(baseDir + config.js + 'controllers/**/*.js');
  if (includeTest) {
    jsfiles.push(baseDir + config.js + 'test/**/*.js');
  }
  jsfiles.push(baseDir + config.js + 'startup.js');

  return gulp
    .src(jsfiles)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(plumber.stop())
    .pipe(gulp.dest(baseDir + config.distjs));
}

function cssBuild(config) {
  var cssfiles = [];
  cssfiles.push(baseDir + config.css + 'common.css');
  cssfiles.push(baseDir + config.css + '**/*.css');
  if (!includeTest) {
    cssfiles.push('!' + baseDir + config.css + 'test/**/*.css');
  }

  return gulp
    .src(cssfiles)
    .pipe(plumber())
    .pipe(concat('app.min.css'))
    .pipe(mincss())
    .pipe(plumber.stop())
    .pipe(gulp.dest(baseDir + config.distcss));
}

gulp.task('clear', function() {
  del.sync([baseDir + 'dist/**/*'], {
    force: true
  });
});

/*公用方法完毕==========================================================================*/

/*app目录相关==========================================================================*/
/*清理发布*/
gulp.task('app-clear', function() {
  return clearBuild(appconfig.app);
});

/*项目lib文件打包======================================================================*/
/*js第三方库打包*/
gulp.task('app-jslib', function() {
  return jslibBuild(appconfig.app);
});

/* 第三方libs目录打包 */
gulp.task('app-libs', function() {
  return libsBuild(appconfig.app);
});

/*css第三方库*/
gulp.task('app-csslib', function() {
  return csslibBuild(appconfig.app);
});

/*字体文件*/
gulp.task('app-fonts', function() {
  return fontsBuild(appconfig.app);
});

gulp.task('app-lib', ['app-jslib', 'app-libs', 'app-csslib', 'app-fonts'], function() {
  console.log('处理第三库依赖');
});

/*项目相关文件处理======================================================================*/
/*图片文件处理*/
gulp.task('app-images', function() {
  return imagesBuild(appconfig.app);
});

/*项目html文件*/
gulp.task('app-html', function() {
  return htmlBuild(appconfig.app);
});

/*项目js文件*/
gulp.task('app-js', function() {
  return jsBuild(appconfig.app);
});

/*项目css打包*/
gulp.task('app-css', function() {
  return cssBuild(appconfig.app);
});

gulp.task('app-dev', ['app-images', 'app-html', 'app-js', 'app-css'], function() {
  console.log('处理开发任务');
});
/*app目录相关结束==========================================================================*/

/*排除test*/
gulp.task('exclude-test', function() {
  includeTest = false;
  console.log('排除test文件');
});

/*默认打包任务*/
gulp.task('default', ['exclude-test', 'app-clear', 'app-lib', 'app-dev'], function() {
  del.sync(baseDir + appconfig.app.dist + '**/*.map');
  console.log('打包任务完成');
});

/*app开发watch任务*/
gulp.task('app-watch', ['app-lib', 'app-dev'], function() {
  watch([baseDir + appconfig.app.js + '**/*.js'], function() {
    gulp.start('app-js');
  });

  watch([baseDir + appconfig.app.css + '**/*.css'], function() {
    gulp.start('app-css');
  });

  watch([baseDir + appconfig.app.html + '**/*.html'], function() {
    gulp.start('app-html');
  });

  watch([baseDir + appconfig.app.images + '**/*'], function() {
    gulp.start('app-images');
  });
});
