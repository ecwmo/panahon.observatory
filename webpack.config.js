const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: [
    "core-js/modules/es.promise",
    "core-js/modules/es.array.iterator",
    path.resolve("./src/app.js"),
  ],
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve("./dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: {
          loader: "url-loader",
        },
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
  ],
};
