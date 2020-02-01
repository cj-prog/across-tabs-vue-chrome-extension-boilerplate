const {
  author,
  description,
  // eslint-disable-next-line camelcase
  homepage_url,
  // eslint-disable-next-line camelcase
  short_name,
  version,
} = require('./package.json');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const { VueLoaderPlugin } = require('vue-loader');
const P = require('./global_constants').P;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = {
  mode: process.env.NODE_ENV,
  node: { process: true },
  context: __dirname + '/src',
  entry: {
    background: P.chrome.background,
    main: './main.js',
    content: P.chrome.content,
  },
  output: {
    path: P.dist_chrome,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.vue$/,
        loaders: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader?indentedSyntax',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?emitFile=false',
        },
      },
      {
        test: /\.(svg|eot|woff|ttf|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.styl$/,
        loader: ['style-loader', 'css-loader', 'stylus-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: false,
      title: 'across-vue chrome extension',
      template: 'index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin([
      { from: 'icons', to: 'icons', ignore: ['icon.xcf'] },
      { from: 'child.html', to: 'child.html' },
      {
        from: 'manifest.json',
        to: 'manifest.json',
        transform(content, path) {
          return transformManifest(content);
        },
      },
    ]),
    new WebpackShellPlugin({
      onBuildEnd: ['node scripts/remove-evals.js'],
    }),
  ],
  devtool: 'cheap-module-source-map',
};

if (process.env.HMR === 'true') {
  env.plugins = (env.plugins || []).concat([new ChromeExtensionReloader()]);
}

function transformManifest(buffer) {
  var manifest = JSON.parse(buffer.toString());
  manifest.version = version;
  // eslint-disable-next-line camelcase
  manifest.short_name = short_name;
  manifest.description = description;
  manifest.author = author;
  // eslint-disable-next-line camelcase
  manifest.homepage_url = homepage_url;
  return JSON.stringify(manifest, null, 2);
}

module.exports = config => env;
