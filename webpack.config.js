const path = require('path')
const libDir = path.join(__dirname, 'lib')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: libDir,
    filename: 'index.js',
    library: 'dlxlib',
    libraryTarget: 'umd',
    // https://medium.com/@JakeXiao/window-is-undefined-in-umd-library-output-for-webpack4-858af1b881df
    // https://github.com/webpack/webpack/issues/6522
    globalObject: 'this'
  }
}
