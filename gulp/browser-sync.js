const gulp = require('gulp'),
      bs = require('browser-sync').create();

gulp.task('browser-sync', () => {
  bs.init({
    files: ['./instance/**/*'],
    server: {
      baseDir: './instance/',
    },
  });
});
