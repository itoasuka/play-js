/*
 * 各ファイルパスの設定
 */
const path = require('path');

const env = {};

/** 
 * 入力ファイルのベース 
 *
 * @type {string}
 */
env.inputBase = path.resolve(__dirname, 'app');

/**
 * 出力ファイルのベース
 *
 * @type {string}
 */
env.outputBase = path.resolve(__dirname, 'build');

/**
 * Webpack でひとつに固めるソースの置き場
 *
 * Webpack でまとめられるものならばなんでも置きます。
 *
 * @type {string}
 */
env.webpackBase = path.resolve(env.inputBase, 'webpack');

/**
 * Webpack で扱う JavaScript ファイル
 *
 * @type {string}
 */
env.webpackJs = [
  path.join(env.webpackBase, '**/*.js'),
  path.join(env.webpackBase, '**/*.jsx')
];

/**
 * SASS で処理するソースの置き場
 *
 * @type {string}
 */
env.sassSrc = [
  path.resolve(env.inputBase, 'sass/**/*.scss'),
  path.resolve(env.inputBase, 'sass/**/*.sass')
];

/**
 * テストコードの置き場
 *
 * @type {string}
 */
env.testDir = path.resolve(__dirname, 'test');

/**
 * テストのエントリポイント
 * 
 * @type {string}
 */
env.testEntryPoint = path.join(env.testDir, 'test_index.js');

/**
 * Webpack の設定ファイルのパス
 *
 * @type {string}
 */
env.webpackConfig = path.resolve(__dirname, 'webpack.config.js');

/**
 * Karma 用 Webpack 設定ファイルのパス
 *
 * @type {string}
 */
env.karmaWebpackConfig = path.resolve(__dirname, 'karma.webpack.config.js');

/**
 * Karma の設定ファイルのパス
 *
 * @type {string}
 */
env.karmaConfig = path.resolve(__dirname, 'karma.conf.js');

/**
 * 処理済みアセット（配布用アセット）の置き場
 *
 * @type {string}
 */
env.distAssetsDir = path.resolve(env.outputBase, 'assets');

/**
 * node モジュールの置き場
 *
 * @type {string}
 */
env.nodeModules = path.resolve(__dirname, 'node_modules');

module.exports = env;
