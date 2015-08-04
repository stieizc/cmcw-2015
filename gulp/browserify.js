var gulp       = require('gulp');
var gutil     = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var watchify   = require('watchify');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');

function genBundler(watch=false) {
  var args = {
    entries: ['./src/scripts/main.js'],
    debug: true,
    transform: ['babelify'],
  };
  if (watch)
    for (var k in watchify.args) args[k] = watchify.args[k];
  var bundler = browserify(args);
  if (watch) return watchify(bundler);
  else return bundler;
}

function rebundle(bundler) {
  return bundler
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true,
      debug: true
    }))
    .pipe(sourcemaps.write('./sourcemaps/'))
    .pipe(gulp.dest('./dist/'));
}

gulp.task('browserify', () => {
  var bundler = genBundler();
  return rebundle(bundler);
});

gulp.task('watchify', () => {
  var bundler = genBundler(true);
  bundler.on('update', () => rebundle(bundler));
  return rebundle(bundler);
});
