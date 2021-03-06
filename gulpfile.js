﻿var gulp = require('gulp');
var plug = require('gulp-load-plugins')();

var jsLibraries = [
    './App/Libraries/chart.js',
    './App/Libraries/Angular/angular.js',
    './App/Libraries/Angular/angular-route.js',
    './App/Libraries/Angular/angular-animate.js',
    './App/Libraries/Angular/angular-messages.js',
    './App/Libraries/Angular/angular-chart.js',
    './App/Libraries/Firebase/firebase.js',
    './App/Libraries/Firebase/angular-fire.js',
    './App/Libraries/bowser.js',
];

var jsSource = [
    './App/Src/app.js',
    './App/Src/controllers.js',
    './App/Src/directives.js',
    './App/Src/filters.js',
    './App/Src/services.js'
];

var sassSource = [
    './App/Content/Sass/*.scss'
];

var templatesSource = [
    './App/Templates/**/*.html'
];

var compiledTemplates = [
    './Build/Js/templates.js'
];

gulp.task('watch', function() {
    gulp.watch(templatesSource, ['template', 'js']);
    gulp.watch(sassSource, ['styles']);
    gulp.watch(jsSource, ['js']);
    gulp.watch(jsSource, ['hint']);
});

gulp.task('template', function() {
    gulp.src(templatesSource)
        .pipe(plug.angularTemplatecache())
        .pipe(gulp.dest('Build/Js'));
});

gulp.task('styles', function () {
    return gulp
        .src(sassSource)
        .pipe(plug.rubySass({ style: 'expanded' })).on('error', catchError)
        .pipe(plug.autoprefixer('last 2 version', 'ie8', 'ie9'))
        .pipe(gulp.dest('./Build/Css'))
        .pipe(plug.rename({ suffix: '.min' }))
        .pipe(plug.minifyCss())
        .pipe(gulp.dest('./Build/Css'));
});

gulp.task('js', function () {
    return gulp
        .src(jsLibraries.concat(jsSource).concat(compiledTemplates))
        .pipe(plug.concat('all.js'))
        .pipe(gulp.dest('./Build/Js'))
        .pipe(plug.rename({ suffix: '.min' }))
        .pipe(plug.uglify({ mangle: true }))
        .pipe(gulp.dest('./Build/Js'));
});

gulp.task('hint', function () {
    return gulp
        .src(jsSource)
        .pipe(plug.jshint()).on('error', catchError)
        .pipe(plug.jshint.reporter('jshint-stylish'));
});

var catchError = function(err) {
    console.log(err);
    this.emit('end');
};