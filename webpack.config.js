const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  externals:{
    "readline": "commonjs readline"
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      "@": path.resolve(__dirname, 'src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
        exclude: [/node_modules/, /__tests__/, /\.(test|spec)\.ts/],
      }
    ]
  }
}