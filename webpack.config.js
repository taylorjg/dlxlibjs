/* eslint-env node */

const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dlxlib.js',
    libraryTarget: 'umd',
    globalObject: 'this',
    library: 'dlxlib'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      }
    ]
  },
}
