﻿var gulp = require('gulp');
var plug = require('gulp-load-plugins')();

var jsLibraries = [
    './App/JavaScript/Libraries/Angular/angular.js',
    './App/JavaScript/Libraries/Angular/angular-route.js',
    './App/JavaScript/Libraries/Firebase/firebase.js',
    './App/JavaScript/Libraries/Firebase/angular-fire.js',
    './App/JavaScript/Libraries/bowser.js',
];

var jsSource = [
    './App/JavaScript/Src/app.js',
    './App/JavaScript/Src/controllers.js',
    './App/JavaScript/Src/directives.js',
    './App/JavaScript/Src/filters.js',
    './App/JavaScript/Src/services.js'
];

var sassSource = [
    './App/Content/Sass/*.scss'
];

gulp.task('watch', function () {
    gulp.watch(sassSource, ['styles']);
    gulp.watch(jsSource, ['js']);
    gulp.watch(jsSource, ['hint']);
});

gulp.task('styles', function () {
    return gulp
        .src(sassSource)
        .pipe(plug.rubySass({ style: 'expanded' }))
        .pipe(plug.autoprefixer('last 2 version', 'ie8', 'ie9'))
        .pipe(gulp.dest('./Build/Css'))
        .pipe(plug.rename({ suffix: '.min' }))
        .pipe(plug.minifyCss())
        .pipe(gulp.dest('./Build/Css'));
});

gulp.task('js', function () {
    return gulp
        .src(jsLibraries.concat(jsSource))
        .pipe(plug.concat('all.js'))
        .pipe(gulp.dest('./Build/Js'))
        .pipe(plug.rename({ suffix: '.min' }))
        .pipe(plug.uglify({ mangle: true }))
        .pipe(gulp.dest('./Build/Js'));
});

gulp.task('hint', function () {
    return gulp
        .src(jsSource)
        .pipe(plug.jshint())
        .pipe(plug.jshint.reporter('jshint-stylish'));
});