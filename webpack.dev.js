/* eslint-disable */
const merge = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  // watch: true,
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    publicPath: '/',
    watchContentBase: true,
    historyApiFallback: true,
  },
});
