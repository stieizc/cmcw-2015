var gulp        = require('gulp');
var bs = require('browser-sync').create();

gulp.task('browser-sync', () => {
  bs.init({
    files: ['./dist/**/*'],
    proxy: "localhost:5000",
    /*
    server: {
      baseDir: './dist/',
    },
    */
  });
});
