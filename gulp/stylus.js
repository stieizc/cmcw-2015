const gulp = require('gulp');
const gutil = require('gulp-util');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('stylus', () => {
  gulp.src('./src/styles/main.styl')
    .pipe(sourcemaps.init({
      loadMaps: true,
      debug: true
    }))
    .pipe(stylus({
      'include css': true,
    }))
    .on('error', gutil.log.bind(gutil, 'Stylus Error'))
    .pipe(sourcemaps.write('./sourcemaps/'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch-stylus', ['stylus'], () => {
  return gulp.watch('./src/styles/*.styl', ['stylus']);
});
