const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/app.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  externals: {
    readline: "commonjs readline",
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        loader: "ts-loader",
      },
    ],
  },
};
