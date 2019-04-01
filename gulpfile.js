var babel        = require('gulp-babel'),
    beeper       = require('beeper'),
    browserSync  = require('browser-sync'),
    cache        = require('gulp-cached'),
    concat       = require('gulp-concat'),
    cssnano      = require('gulp-cssnano'),
    eslint       = require('gulp-eslint'),
    gulp         = require('gulp'),
    iconfont     = require('gulp-iconfont'),
    iconfontCSS  = require('gulp-iconfont-css'),
    imagemin     = require('gulp-imagemin'),
    kss          = require('kss'),
    notify       = require('gulp-notify'),
    plumber      = require('gulp-plumber'),
    postcss      = require('gulp-postcss'),
    prefix       = require('autoprefixer'),
    sass         = require('gulp-sass'),
    sassGlob     = require('gulp-sass-glob'),
    scsslint     = require('gulp-sass-lint'),
    sourcemaps   = require('gulp-sourcemaps'),
    terser       = require('gulp-terser'),
    reload       = browserSync.reload,
    runTimestamp = Math.round(Date.now() / 1000);

// Prefix with project code
var fontName = 'icons';

// Paths
var localDev = 'http://local.yourlocal.com';

var paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dist: 'dist/css'
  },
  styleguide: {
    dist: 'styleguide/',
    homepage: '../kss/styleguide.md'
  },
  scripts: {
    src: 'src/js/custom/**/*.js',
    dist: 'dist/js'
  },
  images: {
    src: 'src/images/**/*',
    dist: 'dist/images',
    icons: 'dist/images/icons/*.svg'
  },
  icons: {
    path: 'src/scss/templates/_icons-template.scss',
    target: '../../../src/scss/global/__icons.scss',
    fontPath: '../dist/fonts/icons/',
    dist: 'dist/fonts/icons/'
  }
}

gulp.task('scss', () => {
  return gulp.src('./src/scss/styles.scss')
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
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(reload({stream:true}));
});

gulp.task("scsslint", () => {
  return gulp.src(paths.styles.src)
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
  return gulp.src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dist));
});

gulp.task('iconfont', () => {
  return gulp.src(paths.images.icons)
    .pipe(iconfontCSS({
      fontName: fontName,
      path: paths.icons.path,
      targetPath: paths.icons.target,
      fontPath: paths.icons.fontPath,
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
    .pipe(gulp.dest(paths.icons.dist));
});

gulp.task('eslint', () => {
  return gulp.src(paths.scripts.src)
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
  return gulp.src(paths.scripts.src)
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
      .pipe(concat('app.js'))
      .pipe(terser())
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest(paths.scripts.dist))
      .pipe(reload({stream:true}));
});

// Browser Sync
gulp.task('browser-sync', () => {
  browserSync({
    notify: false,
    proxy: {
      target: localDev
    }
  });
});

// KSS Styleguides
gulp.task('kss', function(){
  return kss({
    source: 'src/scss/',
    title: 'Styleguide',
    builder: 'src/kss/theme',
    destination: paths.styleguide.dist,
    homepage: paths.styleguide.homepage,
    css: '../'+ paths.styles.dist + '/styles.css'
  });
});

gulp.task('styles', gulp.series('scss', 'scsslint'));

gulp.task('watch', () => {
  gulp.watch(paths.styles.src, gulp.series('styles')).on('change', reload);
  gulp.watch(paths.scripts.src, gulp.series('scripts', 'eslint')).on('change', reload);
  gulp.watch(paths.images.src, gulp.series('optimize-images')).on('change', reload);
});

gulp.task('icons', gulp.series('optimize-images', 'iconfont', 'styles'));
gulp.task('default', gulp.parallel('styles', 'browser-sync', 'watch'));
