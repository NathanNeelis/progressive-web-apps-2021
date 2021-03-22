const gulp = require('gulp')
const concat = require('gulp-concat');
const minify = require('gulp-minify');

return gulp.src([
        './src/js/homeSearch.js',
        './src/js/movieSearch.js',
    ])
    .pipe(minify({
        noSource: true,
        ext: {
            min: '.js'
        }
    }))
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./static/js'))