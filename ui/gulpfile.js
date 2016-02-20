const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const gutil = require('gulp-util');
const webpack = require('webpack');
const runSequence = require('run-sequence');
const karma = require('karma');
const path = require('path');
const minimist = require('minimist');
const fs = require('fs');
const mkdirp = require('mkdirp');

const args = minimist(process.argv.slice(2));
const md5 = () => {
  const through2 = require('through2');
  const crypto = require('crypto');

  return through2.obj(function (file, enc, cb) {
    const stream = crypto.createHash("md5");
    file.pipe(stream);
    const hash = stream.read().toString('hex');
    const hashfile = new gutil.File({
      cwd: file.cwd,
      base: file.base,
      path: file.path + '.md5',
      contents: new Buffer(hash)
    });
    this.push(hashfile);
    cb();
  });
};

gulp.task('clean', del.bind(null, ['build']));

gulp.task('webpack-dev-server', () => {
  const WebpackDevServer = require('webpack-dev-server');
  const config = require('./webpack.config.js');
  const compiler = webpack(config);

  new WebpackDevServer(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: !args.COLORLESS
    },
    contentBase: 'http://localhost:9000'
  }).listen(8080, 'localhost', (err) => {
    if(err) throw new $.util.PluginError('webpack-dev-server', err);
    // Server listening
    $.util.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/');

    // keep the server alive or continue?
    // callback();
  });
});

gulp.task('watch', ['webpack-dev-server']);

gulp.task('webpack', () => {
  const webpackStream = require('webpack-stream');
  const config = require('./webpack.config.js');
  config.module.preLoaders = config.module.preLoaders.filter((e) => e.loader !== 'eslint-loader'); 
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

  return gulp.src('app/main.js')
    .pipe(webpackStream(config))
    .pipe(gulp.dest('build/assets/'));
});

gulp.task('md5', () => {
  return gulp.src('build/assets/**/*')
    .pipe(md5())
    .pipe(gulp.dest('build/assets/'));
});

gulp.task('gzip', () => {
  return gulp.src(['build/assets/**/*', '!build/assets/**/*.md5'])
    .pipe($.gzip())
    .pipe(gulp.dest('build/assets/'));
});

gulp.task('build', ['clean'], (cb) => {
  runSequence('webpack', 'md5', 'gzip', cb);
});

gulp.task('karma', (cb) => {
  const webpackConfig = Object.assign({}, require('./karma.webpack.conf.js'));
  webpackConfig.isparta = {
    embedSource: true,
    noAutoWrap: true
  };
  webpackConfig.module.loaders = webpackConfig.module.loaders.map((e) => {
    if (e.loader === 'babel') {
      e.exclude.push(path.resolve('app/'));
    }

    return e;
  });
  webpackConfig.module.loaders.push({
    test: /\.jsx?/,
    include: path.resolve('app/'),
    loader: 'isparta'
  });

  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    autoWatch: false,
    singleRun: true,
    reporters: ['dots', 'coverage', 'junit'],
    colors: !args.COLORLESS,
    webpack: webpackConfig
  }, cb).start();
});

gulp.task('karma:watch', (cb) => {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
    colors: !args.COLORLESS
  }, cb).start();
});

gulp.task('test', ['karma']);

gulp.task('eslint', () => {
  mkdirp.sync('build/eslint');
  return gulp.src(['app/**/*.js', 'app/**/*.jsx'])
    .pipe($.eslint())
    .pipe($.eslint.format('checkstyle', fs.createWriteStream('build/eslint/checkstyle-result.xml')));
});
