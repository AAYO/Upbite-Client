
//====================================================================================
// Dependencies
//====================================================================================
var gulp        = require('gulp');
var serve       = require('gulp-serve');


gulp.task('default', serve({
    root: './',
    port: 4000
}));