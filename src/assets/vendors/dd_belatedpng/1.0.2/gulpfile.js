var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('default', function () {
    return gulp.src(['lib/DD_belatedPNG_0.0.8a.js', 'lib/fire.js'])
                .pipe(plugins.concat('DD_belatedPNG_0.0.8a.js'))
                .pipe(gulp.dest('dist'))
                .pipe(plugins.uglify())
                .pipe(plugins.rename('DD_belatedPNG_0.0.8a.min.js'))
                .pipe(gulp.dest('dist'));
});
