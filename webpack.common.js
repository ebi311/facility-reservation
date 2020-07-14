/* eslint-disable */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const distPath = path.join(__dirname, './public');

module.exports = {
  entry: path.join(__dirname, './src/', 'index.tsx'),
  output: {
    path: distPath,
    publicPath: '/',
    filename: 'bundle.js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.join(__dirname, 'tsconfig.json'),
            },
          },
        ],
      },
      {
        test: /\.eot|\.ttf|\.woff2?|\.svg$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './resources/index.html'),
    }),
  ],
  devServer: {
    contentBase: distPath,
  },
};
