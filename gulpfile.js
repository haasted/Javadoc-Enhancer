var gulp = require('gulp'),
	minify = require('gulp-minify'),
	del = require('del'),
	stripDebug = require('gulp-strip-debug');

gulp.task('default', ['clean', 'minify']);

gulp.task('minify', function() {
  gulp.src('src/jdocenhance.js')
	.pipe(stripDebug())
    .pipe(minify({}))
    .pipe(gulp.dest('dist'));

  gulp.src('src/bookmarklet.js')
	.pipe(stripDebug())
  	.pipe(minify({}))
  	.pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
	return del(
		['dist/*']
	);
});