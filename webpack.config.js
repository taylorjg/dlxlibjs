const path = require('path');
const libDir = path.join(__dirname, 'lib');

module.exports = {
    entry: './src/index.js',
    output: { path: libDir, filename: 'index.js' },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }
        ]
    }
};
