import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import gutil from 'gulp-util';
import webpack from 'webpack';
import runSequence from 'run-sequence';
import karma from 'karma';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';

import env from './env.js';

const $ = gulpLoadPlugins();

const allDistAssets = path.join(env.distAssetsDir, '**/*');

/**
 * md5 ファイルを作成するストリームを返します。
 *
 * @return {Writable} ストリーム 
 */
function md5() {
  const through2 = require('through2');
  const crypto = require('crypto');

  return through2.obj(function (file, enc, cb) {
    const stream = crypto.createHash("md5");
    file.pipe(stream);
    const hash = stream.read().toString('hex');
    const hashfile = new gutil.File({
      cwd: file.cwd,
      base: file.base,
      path: `${file.path}.md5`,
      contents: new Buffer(hash)
    });
    this.push(hashfile);
    cb();
  });
}

/*
 * ディレクトリを削除する
 */
gulp.task('clean', del.bind(null, [env.outputBase]));

/*
 * webpack-dev-server を起動する
 */
gulp.task('webpack-dev-server', () => {
  const WebpackDevServer = require('webpack-dev-server');
  const config = require(env.webpackConfig);
  const compiler = webpack(config);

  new WebpackDevServer(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    },
    contentBase: 'http://localhost:9000'
  }).listen(8080, 'localhost', (err) => {
    if(err) throw new $.util.PluginError('webpack-dev-server', err);

    $.util.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/');
  });
});

/*
 * リソース監視を開始する。
 */
gulp.task('watch', ['webpack-dev-server', 'sass:watch']);

/*
 * Webpack でリソースをまとめる。
 *
 * ソースの最適化なども行い出荷品質にする。
 */
gulp.task('webpack', (cb) => {
  const config = require(env.webpackConfig);
  config.plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      '__DEV__': false
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ];

  webpack(config, (err, stats) => {
    if(err) throw new $.util.PluginError("webpack", err);
    $.util.log("[webpack]", stats.toString({
      colors: true
    }));
    cb();
  });
});

/*
 * .md5 ファイルを作る。
 */
gulp.task('md5', () => {
  return gulp.src([allDistAssets, `!${path.join(env.distAssetsDir, '**/*.gz')}`])
    .pipe(md5())
    .pipe(gulp.dest(env.distAssetsDir));
});

/*
 * .gz ファイルを作る。
 */
gulp.task('gzip', () => {
  return gulp.src([allDistAssets, `!${path.join(env.distAssetsDir, '**/*.md5')}`])
    .pipe($.gzip())
    .pipe(gulp.dest(env.distAssetsDir));
});

/*
 * すべてのリソースを処理して出荷品質にする。
 */
gulp.task('build', ['clean'], (cb) => {
  runSequence(['webpack', 'sass'], 'md5', 'gzip', cb);
});

/*
 * Karma によるテストを行う。
 */
gulp.task('karma', (cb) => {
  const config = Object.assign({}, require(env.karmaWebpackConfig));
  config.isparta = {
    embedSource: true,
    noAutoWrap: true
  };
  // eslint は実行しない。eslint タスクを使用すること。
  config.module.preLoaders = config.module.preLoaders.filter((e) => e.loader !== 'eslint-loader'); 
  config.module.loaders = config.module.loaders.map((e) => {
    if (e.loader === 'babel') {
      e.exclude.push(env.webpackBase);
    }

    return e;
  });
  config.module.loaders.push({
    test: /\.jsx?/,
    include: env.webpackBase,
    loader: 'isparta'
  });

  new karma.Server({
    configFile: env.karmaConfig,
    autoWatch: false,
    singleRun: true,
    reporters: ['dots', 'coverage', 'junit'],
    colors: true,
    webpack: config
  }, cb).start();
});

/*
 * Karma を実行しソースの監視を行う。
 */
gulp.task('karma:watch', (cb) => {
  new karma.Server({
    configFile: env.karmaConfig,
    singleRun: false,
    colors: true
  }, cb).start();
});

/*
 * karma タスクのエイリアス
 */
gulp.task('test', ['karma']);

/*
 * eslint で書式チェックを行う。
 */
gulp.task('eslint', () => {
  const distDir = path.join(env.outputBase, 'eslint');
  mkdirp.sync(distDir);

  return gulp.src(env.webpackJs)
    .pipe($.eslint())
    .pipe($.eslint.format('checkstyle', fs.createWriteStream(path.join(distDir, 'checkstyle-result.xml'))));
});

/*
 * SASS で処理を行う。
 */
gulp.task('sass', () => {
  return gulp.src(env.sassSrc)
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer('last 2 version'))
    .pipe($.cssnano())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(env.distAssetsDir));
});

/*
 * SASS 対象リソースの監視を行う。
 */
gulp.task('sass:watch', () => {
  gulp.watch(env.sassSrc, ['sass']);
});
