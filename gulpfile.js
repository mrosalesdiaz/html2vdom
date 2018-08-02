var gulp = require('gulp');
var webserver = require('gulp-webserver');
 
gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
    	open:'/index.html',
      livereload: true,
      directoryListing: true
    }));
});