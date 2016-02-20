const fs = require('fs');
const webpackConfig = Object.assign({}, require('./webpack.config.js'));
const babelConfig = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));
const testBabelConfig = Object.assign({}, babelConfig);

testBabelConfig.plugins.push('babel-plugin-espower');

// Karmaで使わない（参照してはいけない）項目を削除
Reflect.deleteProperty(webpackConfig, 'entry');
Reflect.deleteProperty(webpackConfig, 'output');
webpackConfig.devtool = 'inline-source-map';
webpackConfig.babel = testBabelConfig;
webpackConfig.module.loaders.push({
  test: /\.json$/,
  loader: 'json'
});
webpackConfig.node = {
  fs: 'empty'
};

module.exports = webpackConfig;

