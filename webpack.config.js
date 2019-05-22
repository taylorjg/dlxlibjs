const path = require('path')
const libDir = path.join(__dirname, 'lib')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: libDir,
        filename: 'index.js',
        library: 'dlxlib',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }
        ]
    }
}
