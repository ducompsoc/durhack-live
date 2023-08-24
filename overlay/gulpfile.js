'use strict';

import gulp from 'gulp';
import sassMeta from 'gulp-sass';
import node_sass from 'node-sass';
import browserSyncMeta from 'browser-sync';
import ts from 'gulp-typescript';


const sass = sassMeta(node_sass);
const browserSync = browserSyncMeta.create();
const tsProject = ts.createProject('tsconfig.json');

gulp.task('assets', () => {
    return gulp.src('./src/**/*.{html,js,svg,png,jpg,jpeg,gif,ico,woff}')
        .pipe(gulp.dest('./dist'));
});

gulp.task('sass', () => {
    return gulp.src('./src/**/*.scss')
        .pipe(sass().on('error', console.error))
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

    gulp.series('icons');
    gulp.watch('./src/**/*.scss', gulp.series('sass'));
    gulp.watch('./src/**/*.ts', gulp.series('ts'));
    gulp.watch('./src', gulp.series('assets')).on('change', browserSync.reload);
}));