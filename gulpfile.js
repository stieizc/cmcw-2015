require("babel/register");
var gulp       = require('gulp');
var requireDir = require('require-dir');

requireDir('./gulp');

// Useful tasks:
// dist: build the app
// develop: run watchify, watch tasks and browser-sync
gulp.task('default', ['develop']);
