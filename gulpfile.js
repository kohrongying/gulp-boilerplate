var gulp 	= require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    minifyCSS = require('gulp-clean-css'),
    minifyHTML = require('gulp-htmlmin'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat')

styles = () => {
    return gulp.src('src/styles/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(concat('all.css'))
        .pipe(gulp.dest('docs'))
        .pipe(browserSync.reload({
            stream: true
        }));
};

html = () => {
    return gulp.src('src/*.html')
        .pipe(minifyHTML({collapseWhitespace: true}))
        .pipe(gulp.dest('docs'))

};

scripts = () => {
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('docs'))

};

clean = (done) => {
    del(['docs']);
    done();
};

watch = (done) => {
    gulp.watch('src/styles/*.scss', styles);
    gulp.watch('src/*.html', html);
    gulp.watch('src/js/*.js', scripts);
    gulp.watch(['docs/*.js', 'docs/*.html']).on('change', browserSync.reload)
    done()
}

syncBrowser = (done) => {
    browserSync.init({
		server: './docs'
    });
    done();
}

build = (done) => {
    gulp.series(clean, gulp.parallel(styles, html, scripts,syncBrowser, watch))(done);
};

gulp.task('default', build)