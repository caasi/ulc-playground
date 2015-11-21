var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: [
    path.resolve(__dirname, 'index')
  ],
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js',
    publicPath: ''
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
        presets: ['es2015', 'react']
      },
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
