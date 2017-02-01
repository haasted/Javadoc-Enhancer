var gulp = require('gulp'),
	minify = require('gulp-minify'),
	del = require('del'),
	stripDebug = require('gulp-strip-debug'),
	connect = require('gulp-connect'),
	ncp = require("copy-paste");

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

gulp.task('server', function() {
	ncp.copy('!function(){function a(a,e){var n=document.createElement("script");n.src=a,n.onload=e,document.getElementsByTagName("head")[0].appendChild(n)}a("//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js",function(){a("//localhost:8080/jdocenhance.js")})}();', function() {
		console.log('Javadoc-Enhancer is now available using the bookmarklet that has been copied to the clipboard.');
	});

	connect.server({
		root: 'src',
		livereload : false
	});
});

gulp.task('clean', function() {
	return del(
		['dist/*']
	);
});