var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    'eventsource-polyfill',
    'webpack-hot-middleware/client',
    path.resolve(__dirname, 'index')
  ],
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js',
    publicPath: ''
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loaders: ['style', 'css?modules', 'postcss'],
      include: __dirname
    }]
  },
  postcss: function() {
    return [autoprefixer];
  }
};
