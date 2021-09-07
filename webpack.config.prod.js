// path は、パス文字列を操作するための node.js ビルドインのツール
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // デバッグ情報を付与する。
  // 本番環境では、'product' とすることで、
  // コードが最適化されサイズが小さくなる。
  mode: 'production',
  // 初めに読み込まれるファイル
  entry: './src/index.tsx',
  // 出力先の設定
  output: {
    // 出力先ファイル名
    filename: 'bundle.js',
    // 出力先フォルダ
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        // 対象のファイルを正規表現で記述する
        test: /\.tsx?$/,
        // TypeScript をコンパイルするローダー
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    // import する対象の拡張子
    extensions: ['.ts', '.tsx', '.js', '.jsx' ],
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: 'resources/index.html',
      publicPath: '/',
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    historyApiFallback: true,
  },
};
