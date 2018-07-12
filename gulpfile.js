'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('webpack');
var browserSync = require('browser-sync').create();
var prefix = require('gulp-autoprefixer');
var gulpif = require('gulp-if');
var notify = require("gulp-notify");


var proxy = false; // 'http://localhost/'
var port = 8000;

var style = {
	outputStyle: 'compressed', // nested |compact | expanded | compressed
	sourcemap: true
}




gulp.task('sass', function () {
  return gulp.src('src/scss/main.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: style.outputStyle}).on('error', function(err){
		notify().write(err);
		this.emit('end');
	}))
	.pipe(prefix({
        browsers: ['last 3 versions']
    }))
	.pipe(gulpif(style.sourcemap, sourcemaps.write()))
	.pipe(gulp.dest('./dist/'));
	// .pipe(notify({ message: 'SASS compile' }));
});


gulp.task('webpack', function(done) {
  webpack({
	entry: './src/main.js',
	output: {
		path: __dirname + '/dist/',
		filename: "boundle.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
				}
			}
		]
  }
  }, function(error) {
	var pluginError;

	if (error) {
	  pluginError = new gulpUtil.PluginError('webpack', error);

	  if (done) {
		done(pluginError);
	  } else {
		gulpUtil.log('[webpack]', pluginError);
	  }
	  return;
	}

	if (done) {
	  done();
	}
  });
});


gulp.task('watchfile', function() {
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./src/**/*.js', ['webpack']);
    gulp.watch('./**/*.html');
    gulp.watch('../**/*.php');
    gulp.watch('../**/*.twig');
});


gulp.task('serve', function() {
    if( proxy === false ){
	    browserSync.init({
	        server: {
	            baseDir: "./"
	        },
		port: port
	    });
	}else{
	    browserSync.init({
	        proxy: proxy,
		port: port
	    });
	}

	gulp.watch('./src/scss/**/*.scss', ['sass']).on('change', browserSync.reload);
	gulp.watch('./src/**/*.js', ['webpack']).on('change', browserSync.reload);
	gulp.watch('./**/*.html').on('change', browserSync.reload);
	gulp.watch('./**/*.php').on('change', browserSync.reload);
	gulp.watch('./**/*.twig').on('change', browserSync.reload);
});


gulp.task('build', ['sass', 'webpack']);
gulp.task('default', ['build', 'serve']);
gulp.task('watch', ['build', 'watchfile']);
