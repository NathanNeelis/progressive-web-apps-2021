const gulp = require('gulp')
const concat = require('gulp-concat');

return gulp.src([
        './src/js/homeSearch.js',
        './src/js/movieSearch.js',
    ])
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./static/js'))