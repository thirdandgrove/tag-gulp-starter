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
    cssnano     = require('gulp-cssnano');

// LiveReload requires the browser plugin to automatically watch
// for changes and update.

// Prefix with project code
var fontName = 'icons';

// Paths
var paths = {
  styles: [
    'scss/**/*.scss'
  ],
  scripts: [
    'js/*.js'
  ]
}

gulp.task('scss', ['scsslint'], () => {
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

gulp.task('optimize-images', () => {
  gulp.src('./images/**/*', {base: '.'})
    .pipe(imagemin());
});

gulp.task('iconfont', () => {
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

gulp.task('scsslint', () => {
  return gulp.src(paths.styles)
    .pipe(scsslint({
      options: {
        configFile: 'sass-lint.yml'
      }
    }))
    .pipe(scsslint.format())
    .pipe(scsslint.failOnError())
});

gulp.task('eslint', () => {
  gulp.src(paths.scripts)
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
  gulp.src(paths.scripts)
      .pipe(plumber({ errorHandler: function(err) {
        notify.onError({
          title: "Gulp error in " + err.plugin,
          message:  err.toString()
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

gulp.task('watch', () => {
  gulp.watch(paths.styles, ['scss']);
  gulp.watch(paths.scripts, ['scripts', 'eslint']).on('change', reload);
});

gulp.task('icons', ['optimize-images', 'iconfont', 'scss']);
gulp.task('default', ['scss', 'browser-sync', 'watch']);
