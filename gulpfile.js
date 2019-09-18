'use strict';
 
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');
const browsersync = require('browser-sync').create();
const prefix = require('gulp-autoprefixer');
const gulpif = require('gulp-if');
const notify = require("gulp-notify");
const image = require('gulp-image');
const purgecss = require('gulp-purgecss')
const VueLoaderPlugin = require('vue-loader/lib/plugin')


const proxy = false; // 'http://localhost/'
const port = 8000;

const styleConfig = {
	outputStyle: 'nested', // nested |compact | expanded | compressed
	sourcemap: true
}


// BrowserSync
function browserSync(done) {
    if( proxy === false ){
	    browsersync.init({
	        server: {
	            baseDir: "./"
	        },
		port: port
	    });
	}else{
	    browsersync.init({
	        proxy: proxy,
		port: port
	    });
	}

  	done();
}


// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}


// kompilacja sass
function style(done) {
  return gulp
    .src('src/scss/main.scss')
    .pipe(sourcemaps.init())
	.pipe(sass({outputStyle: styleConfig.outputStyle}).on('error', function(err){
		notify().write(err);
		this.emit('end');
	}))
	.pipe(prefix({
        browsers: ['last 3 versions']
    }))
    .pipe(gulpif(styleConfig.sourcemap, sourcemaps.write()))
    .pipe(gulp.dest('./dist/'));

    done();
}


// kompilacja skryptów
function script(done){
  webpack({
	entry: './src/main.js',
	output: {
		path: __dirname + '/dist/',
		filename: "boundle.js"
	},
	module: {
		rules: [
			{
		        test: /\.vue$/,
		        loader: 'vue-loader'
		    },
		    {
		        test: /\.css$/,
		        use: [
		          'vue-style-loader',
		          'css-loader'
		        ]
		    },
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
  	},
  	plugins: [
		new VueLoaderPlugin()
	],
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
}


// optymalicacja zdjęć
function images(done) {
	gulp.src('src/img/**/*')
    	.pipe(image())
    	.pipe(gulp.dest('dist/img'));

    done();
}


// usuwanie nieużywanych styli
function clearCss(done) {
	gulp.src('./dist/main.css')
	    .pipe(
	      purgecss({
	        content: ['./**/*.html', './**/*.php', './dist/**/*.js']
	      })
	    )
    	.pipe(gulp.dest('dist/'))

	done();
}


// Watch files
function watchFiles(done) {
	gulp.watch("./src/scss/**/*.scss", gulp.series(style, browserSyncReload));
	gulp.watch("./src/**/*.js", gulp.series(script, browserSyncReload));

	done();
}



function prepareProduction(done) {
	styleConfig.sourcemap = false;
	styleConfig.outputStyle = 'compressed';

	done();
}


function message(done){
	console.log('\x1b[36m%s\x1b[0m', `

   *************************************************************
   ** Przed wrzuceniem plików na serwer należy użyć polecenia **
   **                    gulp production                      **
   *************************************************************

   - usunięcie sourcemap
   - skompresowanie grafik
   - usunięcie nieużywanych styli

	`);
	done();
}


const build = gulp.parallel(message, style, script);
const watch = gulp.parallel(message, watchFiles, browserSync);
const production = gulp.series(prepareProduction, build, clearCss, images);

gulp.task('default', gulp.parallel(watch));

exports.style = style;
exports.script = script;
exports.images = images;
exports.clearCss = clearCss;

exports.build = build;
exports.watch = watch;
exports.production = production;
