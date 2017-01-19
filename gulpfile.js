var gulp = require('gulp'),
	minify = require('gulp-minify'),
	del = require('del');


gulp.task('default', ['clean', 'minify']);

gulp.task('minify', function() {
  gulp.src('src/jdocenhance.js')
    .pipe(minify({}))
    .pipe(gulp.dest('dist'));

  gulp.src('src/bookmarklet.js')
  	.pipe(minify({}))
  	.pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
	return del(
		['dist/*']
	);
});