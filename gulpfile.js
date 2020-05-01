const gulp = require('gulp');
const del = require('del');
const include = require('gulp-file-include');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
// const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const image = require('gulp-image');
const browserSync = require('browser-sync').create();

const paths = {
	// for Open server domain + ./dist
	OpenServerDir: "/",
	srcDir: "./src/",
	buildDir: "./dist/"
};

const htmlFiles = [
	paths.srcDir + "*.html"
];

const styleFiles = [
	paths.srcDir + "sass/**/*.scss"
];

const jsFiles = [
	paths.srcDir + "js/**/*.js"
];

const imagesFiles = [
	paths.srcDir + "img/**/*.jpg",
	paths.srcDir + "img/**/*.jpeg",
	paths.srcDir + "img/**/*.png",
	paths.srcDir + "img/**/*.svg"
];

const fontsFiles = [
	paths.srcDir + "fonts/*.*"
];

gulp.task('extFiles', function (done) {

	// addExtFile("node_modules/normalize.css/normalize.css",	       'style');
	// addExtFile("node_modules/slick-carousel/slick/slick.css",      'style');
	// addExtFile("node_modules/slick-carousel/slick/slick.min.js",   'js');

	done();
});

gulp.task('html', () => {
	return gulp.src(htmlFiles, { base: './src/' })
		.pipe(include({
			prefix: '@@',
			basepath: './src/'
		}))
		.pipe(gulp.dest(paths.buildDir))
		.pipe(browserSync.stream());
});

gulp.task('styles', () => {
	return gulp.src(styleFiles)
		// Init Sourcemaps
		.pipe(sourcemaps.init())
		//Sass
		.pipe(sass())
		// Concat
		.pipe(concat('style.css'))
		// Autoprefixer
		.pipe(autoprefixer({
			overrideBrowserslist: ['defaults'],
			cascade: false
		}))
		// Sass log error
		.pipe(sass().on('error', sass.logError))
		// Minify CSS
		.pipe(cleanCSS({
			level: 2
		}))
		// Write Sourcemaps
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.buildDir + 'css/'))
		.pipe(browserSync.stream());
});

gulp.task('scripts', () => {
	return gulp.src(jsFiles)
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('main.js'))
		// Minify JS
		// .pipe(uglify({
		// 	mangle: {
		// 		keep_fnames: true
		// 	}
		// }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.buildDir + 'js/'))
		.pipe(browserSync.stream());
});

gulp.task('images', () => {
	return gulp.src(imagesFiles)
		.pipe(image({
			quiet: true
		}))
		.pipe(gulp.dest(paths.buildDir + 'img/'))
		.pipe(browserSync.stream());
});

gulp.task('fonts', () => {
	return gulp.src(fontsFiles)
		.pipe(gulp.dest(paths.buildDir + 'fonts/'))
		.pipe(browserSync.stream());
});

gulp.task('del', () => {
	return del([paths.buildDir])
});

// Watcher
gulp.task('watch', () => {
	browserSync.init({
		// proxy: OpenServerDir
		server: {
			baseDir: paths.buildDir
		}
	});
	gulp.watch([paths.srcDir + "**/*.html"], gulp.series('html'));
	gulp.watch(styleFiles, gulp.series('styles'));
	gulp.watch(jsFiles, gulp.series('scripts'));
	gulp.watch(imagesFiles, gulp.series('images'));
	gulp.watch(imagesFiles, gulp.series('fonts'));
});

// Gulp default task
gulp.task('default', gulp.series('del', 'extFiles', gulp.parallel('html', 'styles', 'scripts', 'images', 'fonts'), 'watch'));

// My Func
function addExtFile(path, type = 'file', destPath = '') {
	if (type == 'js') {
		return gulp.src(path)
			.pipe(gulp.dest(paths.buildDir + 'js/' + destPath));
	} else if (type == 'style') {
		return gulp.src(path)
			.pipe(cleanCSS({
				level: 2
			}))
			.pipe(gulp.dest(paths.buildDir + 'css/' + destPath));
	} else if (type == 'file') {
		return gulp.src(path)
			.pipe(gulp.dest(paths.buildDir + destPath));
	}
}