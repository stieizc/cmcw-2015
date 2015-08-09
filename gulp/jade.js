const gulp  = require('gulp'),
      gutil = require('gulp-util'),
      jade  = require('gulp-jade'),
      config = require('./config');

function doJade(watch=false) {
  return () => {
    gulp.src(config.entry.jade)
      .pipe(jade())
      .on('error', gutil.log.bind(gutil, 'Jade Error'))
      .pipe(gulp.dest(config.out(watch)));
  };
}

gulp.task('jade', doJade());

gulp.task('watch-jade', () => {
  doJade(true)();
  return gulp.watch('./src/**/*.jade', doJade(true));
});
