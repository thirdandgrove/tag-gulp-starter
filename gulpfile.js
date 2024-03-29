// @TODO – Replace gulp-stylelint with official version once it's released.
const beeper = require('beeper');
const browserSync = require('browser-sync');
const cache = require('gulp-cache');
const concat = require('gulp-concat');
const criticalCss = require('gulp-penthouse');
const cssnano = require('cssnano');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const penthouse = require('penthouse');
const postcss = require('gulp-postcss');
const postcssMediaQuery = require('postcss-sort-media-queries');
const prefix = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const swc = require('gulp-swc');
const stylelint = require('@ronilaukkarinen/gulp-stylelint');
const terser = require('gulp-terser');
const reload = browserSync.reload;

// Add options to configure swc: https://swc.rs/docs/configuring-swc
const swcOptions = {
  jsc: {
    target: 'es5',
  },
  sourceMaps: true,
};

// Environments
var env = require('./.env');

// Paths
var paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    critical: '/css/critical.css',
    dist: 'dist/css',
  },
  scripts: {
    src: 'src/js/custom/**/*.js',
    dist: 'dist/js',
  },
  images: {
    src: 'src/images/**/*',
    dist: 'dist/images',
  },
  svg: {
    src: 'src/images/**/*.svg',
    srcOptimized: 'dist/images/svg/',
    dist: 'dist',
  },
};

gulp.task('scss', () => {
  return gulp
    .src('./src/scss/styles.scss')
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: 'Gulp error in ' + err.plugin,
            message: err.toString(),
          })(err);
          beeper();
        },
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(
      postcss([
        prefix({ cascade: false }),
        postcssMediaQuery(),
        pxtorem({
          rootValue: 16,
          unitPrecision: 5,
          mediaQuery: true,
          propList: ['*'],
        }),
        cssnano({ zindex: false, discardUnused: false, autoprefixer: false }),
      ])
    )
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(reload({ stream: true }));
});

gulp.task('stylelint', () => {
  return gulp.src(paths.styles.src).pipe(
    stylelint({
      reporters: [{ formatter: 'string', console: true }],
    })
  );
});

gulp.task('optimize-images', () => {
  return gulp
    .src([paths.images.src, '!' + paths.svg.src])
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dist));
});

gulp.task('optimize-svg', () => {
  return gulp.src(paths.svg.src).pipe(imagemin()).pipe(gulp.dest(paths.svg.srcOptimized));
});

gulp.task('eslint', () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(
      eslint({
        parser: '@babel/eslint-parser',
        rules: {
          'no-mutable-exports': 0,
        },
        globals: ['jQuery', '$'],
        envs: ['browser'],
      })
    )
    .pipe(eslint.format());
});

gulp.task('scripts', () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: 'Gulp error in ' + err.plugin,
            message: err.toString(),
          })(err);
          beeper();
        },
      })
    )
    .pipe(swc(swcOptions))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.scripts.dist))
    .pipe(reload({ stream: true }));
});

// Critical CSS
gulp.task('critical-css', () => {
  return gulp
    .src(paths.styles.dist + '/styles.css')
    .pipe(
      criticalCss({
        out: paths.styles.critical,
        url: env.prod,
        width: 1400,
        height: 900,
        strict: true,
        userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        phantomJsOptions: {
          'ssl-protocol': 'any',
        },
      })
    )
    .pipe(
      postcss([
        cssnano({
          safe: true,
        }),
      ])
    )
    .pipe(gulp.dest('./dist/'));
});

// Browser Sync
gulp.task('browser-sync', () => {
  browserSync({
    notify: false,
    open: 'local',
    proxy: {
      target: env.local,
      ws: true,
    },
    ghostMode: true,
    https: false,
  });
});

// Clear cache
gulp.task('clear', async () => {
  cache.clearAll();
});

gulp.task('styles', gulp.series('scss', 'stylelint'));

gulp.task('watch', () => {
  gulp.watch(paths.styles.src, gulp.series('styles')).on('change', reload);
  gulp.watch(paths.scripts.src, gulp.series('scripts', 'eslint')).on('change', reload);
  gulp.watch(paths.images.src, gulp.series('optimize-images')).on('change', reload);
  gulp.watch(paths.svg.src, gulp.series('optimize-svg')).on('change', reload);
});

gulp.task('default', gulp.parallel('styles', 'browser-sync', 'watch'));
gulp.task(
  'build',
  gulp.series('styles', 'scripts', 'optimize-images', 'optimize-svg', 'critical-css')
);
