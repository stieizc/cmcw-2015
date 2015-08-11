const gulp = require('gulp'),
      gutil = require('gulp-util'),
      stylus = require('gulp-stylus'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer-core'),
      sourcemaps = require('gulp-sourcemaps'),
      config = require('./config');

function st(p) {
  return p.pipe(stylus({
      'include css': true,
    }))
    .on('error', gutil.log.bind(gutil, 'Stylus Error'))
    .pipe(postcss([
      autoprefixer({browsers: ['> 5%']}),
    ]))
    .on('error', gutil.log.bind(gutil, 'AutoPrefixer Error'))
  ;
}

function doStylus(watch=false) {
  return () => {
    var p = gulp.src(config.entry.stylus);
    p = watch ?
      st(p.pipe(sourcemaps.init({
        loadMaps: true,
        debug: true
      }))).pipe(sourcemaps.write())
    : st(p);
    p.pipe(gulp.dest(config.out(watch)));
  };
}

gulp.task('stylus', doStylus());

gulp.task('watch-stylus', () => {
  doStylus(true)();
  return gulp.watch('./src/styles/*.styl', doStylus(true));
});
