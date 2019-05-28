const { terser } = require('rollup-plugin-terser')

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'umd',
    name: 'dlxlib'
  },
  plugins: [
    terser({
      output: {
        comments: "all"
      }
    })
  ]
}
