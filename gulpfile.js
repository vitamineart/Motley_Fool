"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const del = require("del");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const neat = require("bourbon-neat").includePaths;
const bourbon = require("bourbon").includePaths;
const uglify = require("gulp-uglify");
var gutil = require('gulp-util')
var ftp = require('vinyl-ftp')
// const webpack = require("webpack");
// const webpackconfig = require("./webpack.config.js");
// const webpackstream = require("webpack-stream");

var paths = {
  scss: ["app/scss/**/*.scss"]
};

/** FTP Configuration **/
var user = process.env.FTP_USER
var password = process.env.FTP_PWD
var host = 's19.webhost1.ru'
var port = 21
var localFilesGlob = ['app/**/*']
var remoteFolder = '/Motley_Fool'

// helper function to build an FTP connection based on our configuration
function getFtpConnection() {
  return ftp.create({
    host: host,
    port: port,
    user: user,
    password: password,
    parallel: 5,
    log: gutil.log,
  })
}

/**
 * Deploy task.
 * Copies the new files to the server
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy`
 */
// host:     's19.webhost1.ru',
// user:     'petart9742',
// password: '0b3f2449',
gulp.task('ftp-deploy', function() {
  var conn = getFtpConnection()

  return gulp
    .src(localFilesGlob, { base: 'app/', buffer: false })
    .pipe(conn.newer('/extraverst.ru/works/Motley_Fool')) // only upload newer files
    .pipe(conn.dest('/extraverst.ru/works/Motley_Fool'))
})

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "app/"
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean assets
function clean() {
  return del(["dist/assets/"]);
}

// Optimize Images
function images() {
  return gulp
    .src("app/images/**/*")
    .pipe(newer("dist/img"))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }]
      })
    )
    .pipe(gulp.dest("dist/img"));
}

// CSS task
function css() {
  return gulp
    .src(paths.scss)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: [bourbon, neat]
    }))
    .pipe(gulp.dest("app/css/"))
    // .pipe(rename({ suffix: ".min" }))
    // .pipe(postcss([autoprefixer(), cssnano()]))
    // .pipe(gulp.dest("app/css/"))
    .pipe(browsersync.stream());
}

// Lint scripts
function scriptsLint() {
  return gulp
    .src(["app/js/**/*", "./gulpfile.js"])
    .pipe(plumber());
    // .pipe(eslint())
    // .pipe(eslint.format())
    // .pipe(eslint.failAfterError());
}

// Transpile, concatenate and minify scripts
function scripts() {
  return (
    gulp
      .src(["app/js/**/*"])
      .pipe(plumber())
      // .pipe(webpackstream(webpackconfig), webpack)
      .pipe(uglify())
      // folder only, filename is specified in webpack config
      .pipe(gulp.dest("dist/js/"))
      .pipe(browsersync.stream())
  );
}

// Jekyll
function jekyll() {
  return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" });
}

// Watch files
function watchFiles() {
  gulp.watch("app/*.html", browserSyncReload);
  gulp.watch("app/scss/**/*", css);
  gulp.watch("app/js/**/*", gulp.series(scriptsLint, scripts));
  gulp.watch("app/images/**/*", images);
}

// Tasks
gulp.task("images", images);
gulp.task("css", css);
gulp.task("js", gulp.series(scriptsLint, scripts));
gulp.task("jekyll", jekyll);
gulp.task("clean", clean);

// build
gulp.task(
  "build",
  gulp.series(clean, gulp.parallel(css, images, "js"))
);

// watch
gulp.task("watch", gulp.parallel(watchFiles, browserSync));
