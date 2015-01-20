'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var seq = require('run-sequence');

require('require-dir')('./gulp');

gulp.task('deploy', ['makdoc'], function () {
    var deploy = require('gulp-gh-pages');
    var path = require('path');

    return gulp.src(path.join($.makdoc.vars.DIST(),'**/*'))
        .pipe(deploy({
            remoteUrl: 'git@github.com:dogfeet/dogfeet.github.com.git',
            cacheDir: '.gh-pages',
            branch:'master'
        }));
});

// Bower helper
gulp.task('bower', function() {
    return gulp.src('app/bower_components/**/*.{js,css,map}')
        .pipe(gulp.dest('dist/bower_components/'));
});

gulp.task('makdoc:init:after', function(done){
    var returns = function(v) {
        return function(){
            return v;
        };
    };

    $.makdoc.vars.BASE_URL = returns('http://dogfeet.github.io/'),

    done();
});

gulp.task('makdoc:done:after', function(done){
   seq('bower', done)
});
