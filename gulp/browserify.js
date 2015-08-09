const gulp       = require('gulp'),
      gutil      = require('gulp-util'),
      sourcemaps = require('gulp-sourcemaps'),
      browserify = require('browserify'),
      watchify   = require('watchify'),
      source     = require('vinyl-source-stream'),
      buffer     = require('vinyl-buffer'),
      config     = require('./config');

function genBundler(watch=false) {
  const args = {
    entries: [config.entry.js],
    transform: ['babelify'],
  };
  if (watch) {
    args.debug = true;
    for (var k in watchify.args) args[k] = watchify.args[k];
  }
  const bundler = browserify(args);
  if (watch) return watchify(bundler);
  else return bundler;
}

function rebundle(bundler, watch=false) {
  var p = bundler
      .bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('main.js'))
      .pipe(buffer());
  return (
    watch ?
      p.pipe(sourcemaps.init({
        loadMaps: true,
        debug: true
      }))
      .pipe(sourcemaps.write())
    : p
  ).pipe(gulp.dest(config.out(watch)));
}

gulp.task('browserify', () =>
  rebundle(genBundler()));

gulp.task('watchify', () => {
  const bundler = genBundler(true);
  bundler.on('update', () => rebundle(bundler, true));
  return rebundle(bundler, true);
});
