const path = require('path');
const buildDir = path.join(__dirname, 'build');

module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: buildDir,
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: [/node_modules/, /build/],
                use: 'eslint-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    }
};
