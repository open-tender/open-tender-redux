const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    library: 'OpenTenderRedux',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  externals: {
    redux: 'redux',
    '@open-tender/js': '@open-tender/js',
  },
}
