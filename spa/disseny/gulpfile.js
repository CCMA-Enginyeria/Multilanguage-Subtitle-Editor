'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
 
sass.compiler = require('node-sass');
 
gulp.task('sass:build', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('../main/resources/spa/css'));
});
 
gulp.task('sass:watch', function () {
  return gulp.watch('./sass/**/*.scss', ['sass:build']);
});

gulp.task('default', ['sass:build', 'sass:watch']);