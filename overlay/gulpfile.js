'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

sass.compiler = require('node-sass');

gulp.task('assets', () => {
    return gulp.src('./src/**/*.{html,js,svg,png,jpg,jpeg,gif,ico,woff}')
        .pipe(gulp.dest('./dist'));
});

gulp.task('sass', () => {
    return gulp.src('./src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
});

gulp.task('icons', function() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('./dist/webfonts/'));
});

gulp.task('ts', () => {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('./dist'));
});

gulp.task('build', gulp.series('assets', 'sass', 'icons', 'ts'));

gulp.task('serve', gulp.series('build', () => {
    browserSync.init({ server: './dist' });

    gulp.watch('./src/**/*.scss', gulp.series('sass'));
    gulp.watch('./src/**/*.ts', gulp.series('ts'));
    gulp.watch('./src', gulp.series('assets')).on('change', browserSync.reload);
}));