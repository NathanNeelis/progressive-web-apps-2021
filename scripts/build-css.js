const gulp = require('gulp')
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

return gulp.src([
        './src/css/main.css',
        './src/css/nav.css',
        './src/css/forms.css',
        './src/css/detailpage.css',
        './src/css/intro.css',
        './src/css/movieDisplay.css',
        './src/css/scrollbar.css',
        './src/css/search.css',
        './src/css/topmovies.css',
        './src/css/recentlyViewed.css',
    ])
    .pipe(concat('style.css'))
    .pipe(cleanCSS())
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(gulp.dest('./static/css'))