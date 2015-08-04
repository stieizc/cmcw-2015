var gulp  = require('gulp');
var gutil = require('gulp-util');
var jade  = require('gulp-jade');

gulp.task('jade', () => {
  gulp.src('./src/index.jade')
    .pipe(jade())
    .on('error', gutil.log.bind(gutil, 'Jade Error'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch-jade', ['jade'], () => {
  return gulp.watch('./src/**/*.jade', ['jade']);
});
