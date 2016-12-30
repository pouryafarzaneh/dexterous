'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCss = require('gulp-minify-css');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const awspublish = require('gulp-awspublish');


const cssSrc = 'src/stylesheets/';
const cssOutput = 'all.min.css';
const buildDest = 'build';

const webserver = require('gulp-webserver');

gulp.task('serve', () => {
  gulp.src('.')
    .pipe(webserver({
      livereload: {
        enable: true, // need this set to true to enable livereload
        filter: function(fileName) {
          if (fileName.match(/(gif|jpg|jpeg|tiff|png)/)) { // exclude all source maps from livereload
            return false;
          } else {
            return true;
          }
        }
      },
      directoryListing: false,
      open: true,
      port: 9300,
      host: 'localhost',
      fallback: 'index.html'
    }))
    .on('error', err => console.log(err));
});
          
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


 
gulp.task('deploy', function() {
  // create a new publisher using S3 options 
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property 
  var publisher = awspublish.create({
    region: 'eu-west-2',
    params: {
      Bucket: 'www.dexterousgroup.co.uk'
    }
  });
 
  // define custom headers 
  var headers = {
    'Cache-Control': 'max-age=60, no-transform, public'
  };
 
  return gulp.src([
      '**',
      '!./node_modules/**',
      '!./.git/**',
      '!./src/**'
  ])
  .pipe(publisher.publish(headers))
  // create a cache file to speed up consecutive uploads 
  //.pipe(publisher.cache())
  // print upload updates to console 
  .pipe(awspublish.reporter());
});

gulp.task('watch', () => {
    gulp.watch('src/stylesheets/**/*', ['sass']);
});

gulp.task('build', ['sass']);
gulp.task('default', ['build', 'serve', 'watch']);
