var shell = require('shelljs');

var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');

gulp.task('build-gitbook', function(){
  if(shell.exec('npm run gitbook').code != 0){
    echo('Error: generate gitbook failed');
    exit(1);
  }
});

gulp.task('deploy-to-gh-pages', function(){
  return gulp.src('./notes/_book/**/*')
    .pipe(ghPages());
});

gulp.task('publish', ['build-gitbook', 'deploy-to-gh-pages']);
