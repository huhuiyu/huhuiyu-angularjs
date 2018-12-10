//核心插件===============================================
const gulp = require('gulp');
const del = require('del');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const sync = require('gulp-file-sync');
const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs');
const package = JSON.parse(fs.readFileSync('./package.json'));

// 目录信息
const baseDir = __dirname.replace(/[\\]/g, '/') + '/';
const srcDir = baseDir + 'src/';
const distDir = baseDir + 'dist/';
const demoDir = baseDir + 'demo/';
const nodeModulesDir = baseDir + 'node_modules/';
const demoJsDir = demoDir + 'js/';

function getMinJsName() {
  return package.name + '-' + package.version + '.min.js';
}

/* 默认任务 */
gulp.task('default', function() {
  console.log('胡辉煜的angularjs工具集');
});

/* 清理发布目录 */
gulp.task('clean', function() {
  console.log('开始清除发布目录');
  del.sync([distDir + '**/*'], {
    force: true
  });
  console.log('清除发布目录完毕');
});

/* js语法检查 */
gulp.task('jshint', function() {
  console.log('检查js语法');
  return gulp
    .src(srcDir + '*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/* 项目js文件打包 */
gulp.task('jsmin', function() {
  console.log('处理js压缩');
  var jsfile = [];
  jsfile.push(srcDir + 'app.js');
  jsfile.push(srcDir + '*Service.js');

  return gulp
    .src(jsfile)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat(getMinJsName()))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(plumber.stop())
    .pipe(gulp.dest(distDir));
});

gulp.task('demo', ['jsmin'], function() {
  //第三方库
  del.sync([demoJsDir + '**/*'], {
    force: true
  });
  sync(distDir, demoJsDir);
  gulp.src(nodeModulesDir + 'angular/angular.min.js').pipe(gulp.dest(demoJsDir));
  gulp.src(nodeModulesDir + 'angular-sanitize/angular-sanitize.min.js').pipe(gulp.dest(demoJsDir));
});
