var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    eslint       = require('gulp-eslint'),
    scsslint     = require('gulp-sass-lint'),
    cache        = require('gulp-cached'),
    prefix       = require('autoprefixer'),
    notify       = require('gulp-notify'),
    postcss      = require('gulp-postcss'),
    imagemin     = require('gulp-imagemin'),
    iconfont     = require('gulp-iconfont'),
    iconfontCSS  = require('gulp-iconfont-css'),
    sourcemaps   = require('gulp-sourcemaps'),
    cssnano      = require('gulp-cssnano'),
    plumber      = require('gulp-plumber'),
    sassGlob     = require('gulp-sass-glob'),
    babel        = require('gulp-babel'),
    browserSync  = require('browser-sync'),
    reload       = browserSync.reload,
    beeper       = require('beeper'),
    runTimestamp = Math.round(Date.now() / 1000);

// Prefix with project code
var fontName = 'icons';

// Paths
var paths = {
  styles: [
    'scss/**/*.scss'
  ],
  scripts: [
    'js/*.js'
  ],
  images: {
    src: './images/**/*',
    svg: './images/svg/*.svg'
  }
}


gulp.task('scss', () => {
  return gulp.src('scss/styles.scss')
    .pipe(plumber({ errorHandler: function(err) {
      notify.onError({
        title: "Gulp error in " + err.plugin,
        message:  err.toString()
      })(err);
      beeper();
    }}))
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(cssnano({zindex: false}))
    .pipe(postcss([
      prefix({
        browsers: ['last 3 versions'],
        cascade: false })
      ]))
    .pipe(sourcemaps.write('../css/maps'))
    .pipe(gulp.dest('css'))
    .pipe(reload({stream:true}));
});

gulp.task("scsslint", () => {
  return gulp.src(paths.styles)
    .pipe(
      scsslint({
        options: {
          configFile: "sass-lint.yml"
        }
      })
    )
    .pipe(scsslint.format())
    .pipe(scsslint.failOnError());
});

gulp.task('optimize-images', () => {
  return gulp.src(paths.images.src, {base: '.'})
    .pipe(imagemin());
});

gulp.task('iconfont', () => {
  return gulp.src(paths.images.svg)
    .pipe(iconfontCSS({
      fontName: fontName,
      path: './scss/templates/_icons-template.scss',
      targetPath: '../scss/global/__icons.scss',
      fontPath: '../fonts/icons/',
      cacheBuster: runTimestamp
    }))
    .pipe(iconfont({
      fontName: fontName,
      // Remove woff2 if you get an ext error on compile
      formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
      normalize: true,
      fontHeight: 1001,
      prependUnicode: true,
      timestamp: runTimestamp,
    }))
    .pipe(gulp.dest('./fonts/icons/'));
});

gulp.task('eslint', () => {
  return gulp.src(paths.scripts)
    .pipe(eslint({
      parser: 'babel-eslint',
      rules: {
        'no-mutable-exports': 0,
      },
      globals: [
        'jQuery',
        '$',
      ],
      envs: [
        'browser',
      ]
    }))
    .pipe(eslint.format());
});

gulp.task('scripts', () => {
  return gulp.src(paths.scripts)
      .pipe(plumber({ errorHandler: function(err) {
        notify.onError({
          title: "Gulp error in " + err.plugin,
          message: err.toString()
        })(err);
        beeper();
      }}))
      .pipe(babel({
        presets: ['env'],
      }))
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest('js/dist'))
      .pipe(reload({stream:true}));
});

// Browser Sync
gulp.task('browser-sync', () => {
  browserSync({
    proxy: {
      target: "http://local.yourlocal.com"
    }
  });
});

gulp.task('styles', gulp.series('scss', 'scsslint'));

gulp.task('watch', () => {
  gulp.watch(paths.styles, gulp.series('styles')).on('change', reload);
  gulp.watch(paths.scripts, gulp.series('scripts', 'eslint')).on('change', reload);
});

gulp.task('icons', gulp.series('optimize-images', 'iconfont', 'styles'));
gulp.task('default', gulp.parallel('styles', 'browser-sync', 'watch'));
