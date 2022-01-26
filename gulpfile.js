var babel = require('gulp-babel'),
  beeper = require('beeper'),
  browserSync = require('browser-sync'),
  cache = require('gulp-cache'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  cssnano = require('gulp-cssnano'),
  eslint = require('gulp-eslint'),
  fs = require('fs'),
  gulp = require('gulp'),
  imagemin = require('gulp-imagemin'),
  kss = require('kss'),
  notify = require('gulp-notify'),
  penthouse = require('penthouse'),
  plumber = require('gulp-plumber'),
  postcss = require('gulp-postcss'),
  postcssMediaQuery = require('postcss-sort-media-queries'),
  prefix = require('autoprefixer'),
  pxtorem = require('postcss-pxtorem'),
  sass = require('gulp-sass'),
  sassGlob = require('gulp-sass-glob'),
  scsslint = require('gulp-sass-lint'),
  svgSprite = require('gulp-svg-sprites'),
  sourcemaps = require('gulp-sourcemaps'),
  terser = require('gulp-terser'),
  reload = browserSync.reload,
  runTimestamp = Math.round(Date.now() / 1000);

// Environments
var env = require('./.env');

// Paths
var paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    critical: '/css/critical.css',
    dist: 'dist/css',
  },
  styleguide: {
    dist: 'styleguide/',
    homepage: '../kss/styleguide.md',
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
    .pipe(cssnano({ zindex: false, discardUnused: false, autoprefixer: false }))
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
      ])
    )
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(reload({ stream: true }));
});

gulp.task('scsslint', () => {
  return gulp
    .src(paths.styles.src)
    .pipe(
      scsslint({
        options: {
          configFile: 'sass-lint.yml',
        },
      })
    )
    .pipe(scsslint.format())
    .pipe(scsslint.failOnError());
});

gulp.task('optimize-images', () => {
  return gulp
    .src([paths.images.src, '!' + paths.svg.src]) // dont optimize svg sprite images
    .pipe(
      imagemin(
        imagemin.svgo({
          plugins: [
            { convertPathData: { noSpaceAfterFlags: false } },
            { mergePaths: { noSpaceAfterFlags: false } },
          ],
        })
      )
    )
    .pipe(gulp.dest(paths.images.dist));
});

gulp.task('optimize-svg', () => {
  return gulp
    .src(paths.svg.src)
    .pipe(
      imagemin(
        imagemin.svgo({
          plugins: [
            { convertPathData: { noSpaceAfterFlags: false } },
            { mergePaths: { noSpaceAfterFlags: false } },
            { removeViewBox: false },
          ],
        })
      )
    )
    .pipe(gulp.dest(paths.svg.srcOptimized));
});

gulp.task('svgSprite', () => {
  return gulp
    .src(paths.svg.srcOptimized + '*.svg')
    .pipe(
      svgSprite({
        mode: 'symbols',
        preview: {
          symbols: 'svg/index.html',
        },
      })
    )
    .pipe(gulp.dest(paths.svg.dist));
});

gulp.task('eslint', () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(
      eslint({
        parser: 'babel-eslint',
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
    .pipe(
      babel({
        presets: ['env'],
      })
    )
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.scripts.dist))
    .pipe(reload({ stream: true }));
});

// Critical CSS
gulp.task('critical-css', async () => {
  penthouse({
    css: paths.styles.dist + '/styles.css',
    url: env.prod,
    width: 1400,
    height: 900,
    strict: true,
    propertiesToRemove: ['text-decoration'],
    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  }).then(criticalCss => {
    fs.writeFileSync(__dirname + '/includes/global/critical-css.php', criticalCss);
  });
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

// KSS Styleguides
gulp.task('kss', () => {
  return kss({
    source: 'src/scss/',
    title: 'Styleguide',
    builder: 'src/kss/theme',
    destination: paths.styleguide.dist,
    homepage: paths.styleguide.homepage,
    css: ['../' + paths.styles.dist + '/styles.css', '../' + paths.styles.dist + '/kss.css'],
    js: [
      '/core/misc/drupal.js',
      '/core/misc/drupal.init.js',
      '../' + paths.scripts.dist + '/app.js',
    ],
  });
});

// Clear cache
gulp.task('clear', () => {
  cache.clearAll();
});

gulp.task('styles', gulp.series('scss', 'scsslint'));

gulp.task('watch', () => {
  gulp.watch(paths.styles.src, gulp.series('styles')).on('change', reload);
  gulp.watch(paths.scripts.src, gulp.series('scripts', 'eslint')).on('change', reload);
  gulp.watch(paths.images.src, gulp.series('optimize-images')).on('change', reload);
  gulp.watch(paths.svg.src, gulp.series('optimize-svg', 'svgSprite')).on('change', reload);
});

gulp.task('default', gulp.parallel('styles', 'browser-sync', 'watch'));
gulp.task('build', gulp.series('styles', 'scripts', 'kss', 'critical-css', 'svgSprite'));
