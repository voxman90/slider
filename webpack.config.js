const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  entry: "index.js",
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({ template: './src/index.html' }),
    new MiniCSSExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/i,
        use: {
          loader: 'pug-loader',
        },
      },
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      'node_modules',
    ],
    extensions: ['.ts', '.js', '.scss'],
  },
};
