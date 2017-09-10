'use strict'

let gulp = require('gulp');
let ts = require('gulp-typescript');

let clientTsProject = ts.createProject('client/tsconfig.json');
let serverTsProject = ts.createProject('server/tsconfig.json');

gulp.task('default', [ 'clientscripts', 'serverscripts' ]);

gulp.task('clientscripts', () => {
    return clientTsProject.src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('client/app'));
});

gulp.task('serverscripts', () => {
    return serverTsProject.src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('server/app'));
});

gulp.task('watch', () => {
    gulp.watch('client/src/**/*.ts', [ 'clientscripts' ]);
    gulp.watch('server/src/**/*.ts', [ 'serverscripts' ]);
});