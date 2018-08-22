var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    eslint      = require('gulp-eslint'),
    scsslint    = require('gulp-sass-lint'),
    cache       = require('gulp-cached'),
    prefix      = require('autoprefixer'),
    notify      = require('gulp-notify'),
    postcss     = require('gulp-postcss'),
    imagemin    = require('gulp-imagemin'),
    iconfont    = require('gulp-iconfont'),
    iconfontCSS = require('gulp-iconfont-css'),
    sourcemaps  = require('gulp-sourcemaps'),
    cssnano     = require('gulp-cssnano'),
    livereload  = require('gulp-livereload');

// LiveReload requires the browser plugin to automatically watch
// for changes and update.

// Prefix with project code
var fontName = 'icons';

gulp.task('scss', ['scsslint'], function() {
  return gulp.src('scss/styles.scss')
    // .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['node_modules/susy/sass']
    }))
    .on('error', notify.onError({
      title:    "Gulp",
      subtitle: "Failure!",
      message:  "Error: <%= error.message %>"
    }))
    .pipe(cssnano({zindex: false}))
    // .pipe(sourcemaps.write())
    .pipe(postcss([ prefix({ browsers: ['last 2 versions'], cascade: false }) ]))
    .pipe(gulp.dest('css'));
});

gulp.task('optimize-images', function() {
  gulp.src('./images/**/*', {base: '.'})
    .pipe(imagemin());
});

gulp.task('iconfont', function() {
  gulp.src(['./images/svg/*.svg'])
    .pipe(iconfontCSS({
      fontName: fontName,
      path: './scss/templates/icons.scss',
      targetPath: '../scss/global/_icons.scss',
      fontPath: '../fonts/',
    }))
    .pipe(iconfont({
      fontName: fontName,
      // Remove woff2 if you get an ext error on compile
      formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
      normalize: true,
      fontHeight: 1001
    }))
    .pipe(gulp.dest('./fonts/'));
});

gulp.task('scsslint', function () {
  return gulp.src('scss/**/*.scss')
    .pipe(scsslint({
      options: {
        configFile: 'sass-lint.yml'
      }
    }))
    .pipe(scsslint.format())
    .pipe(scsslint.failOnError())
});

gulp.task('eslint', function() {
  gulp.src('js/*.js')
    .pipe(eslint({
      rules: {
        'no-mutable-exports': 0
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss', ['scss']);
  gulp.watch('js/*.js', ['jshint']);
});

gulp.task('icons', ['optimize-images', 'iconfont', 'scss']);
gulp.task('default', ['scss', 'watch']);
