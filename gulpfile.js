'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCss = require('gulp-minify-css');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

const cssSrc = 'src/stylesheets/';
const cssOutput = 'all.min.css';
const buildDest = 'build';

gulp.task('sass', () => {
  return gulp.src(cssSrc.concat('main.scss'))
    .pipe(sass({
      includePaths: [
        './node_modules/bootstrap-sass/assets/stylesheets',
        cssSrc
      ],
      sourcemap: true
    }))
    .on('error', (err) => {
        console.error('Error during building stylesheets', err);
    })
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(rename(cssOutput))
    .pipe(gulp.dest(buildDest));
});

gulp.task('watch', () => {
    gulp.watch('src/stylesheets/**/*', ['sass']);
});

gulp.task('default', ['sass', 'watch']);
