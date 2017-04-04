const path = require('path');
const destDir = path.join(__dirname, 'dest');

module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: destDir,
        filename: 'dlxlib.js'
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
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
