var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    jshint      = require('gulp-jshint'),
    scsslint    = require('gulp-sass-lint'),
    cache       = require('gulp-cached'),
    prefix      = require('autoprefixer'),
    notify      = require('gulp-notify'),
    postcss     = require('gulp-postcss'),
    sourcemaps  = require('gulp-sourcemaps');
    cssnano     = require('gulp-cssnano');

// @todo add LiveReload

gulp.task('scss', function() {
  var onError = function(err) {
    notify.onError({
      title:    "Gulp",
      subtitle: "Failure!",
      message:  "Error: <%= error.message %>"
    })(err);
    this.emit('end'); // @todo see if it works without this
  };

  return gulp.src('scss/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(postcss([ prefix({ browsers: ['last 2 versions'], cascade: false }) ]))
    .pipe(gulp.dest('css'));
});

gulp.task('jshint', function() { // @todo set up custom settings for this
  gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss', ['scss']);
  gulp.watch('js/*.js', ['jshint']);
});

gulp.task('default', ['scss', 'watch']);
