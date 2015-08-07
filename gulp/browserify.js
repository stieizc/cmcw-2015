const gulp       = require('gulp');
const gutil     = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const watchify   = require('watchify');
const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');

function genBundler(watch=false) {
  const args = {
    entries: ['./src/scripts/main.js'],
    debug: true,
    transform: ['babelify'],
  };
  if (watch)
    for (var k in watchify.args) args[k] = watchify.args[k];
  const bundler = browserify(args);
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

gulp.task('browserify', () =>
  rebundle(genBundler()));

gulp.task('watchify', () => {
  const bundler = genBundler(true);
  bundler.on('update', () => rebundle(bundler));
  return rebundle(bundler);
});
