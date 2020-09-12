const gulp 	= require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  minifyCSS = require('gulp-clean-css'),
  minifyHTML = require('gulp-htmlmin'),
  del = require('del'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat')

const styles = () => {
  return gulp.src('src/styles/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('docs'))
    // .pipe(browserSync.stream());
};

const html = () => {
  return gulp.src('src/*.html')
    .pipe(minifyHTML({collapseWhitespace: true}))
    .pipe(gulp.dest('docs'))
    .pipe(browserSync.stream())
};

const scripts = () => {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('docs'))
    .pipe(browserSync.stream())
};

const clean = () => {
  del(['docs']);
};

const watchFiles = () => {
  gulp.watch('src/styles/*.scss', styles);
  gulp.watch('src/*.html', html);
  gulp.watch('src/js/*.js', scripts);
}

const syncBrowser = (done) => {
  browserSync.init({
    server: {
      baseDir: 'docs'
    },
    port: 3000
  });
  done();
}

const build = async () => await gulp.series(clean, scripts, html, styles);
const watch = gulp.series(build, gulp.parallel(watchFiles, syncBrowser))


exports.styles = styles
exports.html = html
exports.scripts = scripts
exports.build = build;
exports.watch = watch;
exports.default = build;