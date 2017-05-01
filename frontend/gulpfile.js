var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber');

gulp.task('scripts', function () {
    return gulp.src(['src/app.js', 'src/**/*.js'])
        .pipe(plumber())
        .pipe(concat('axon.js'))
        .pipe(gulp.dest('build'))
        .pipe(rename('axon.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('default', ['scripts', 'watch']);
