const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: ['./app/webpack/main.js']
  },
  output: {
    path: path.resolve(__dirname, 'build/assets'),
    publicPath: '/assets/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  cache: true,
  debug: true,
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({'__DEV__': true})
  ],
  module: {
    preLoaders: [
      {
        test: /\.jsx?/,
        exclude: [
          path.resolve('node_modules/')
        ],
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.jsx?$/,
        exclude: [
          path.resolve('node_modules/')
        ],
        loader: 'babel'
      }
    ]
  }
};
