const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

process.env.NODE_ENV = "development";

module.exports = {
  mode: "development",
  target: "web",
  devtool: "cheap-module-source-map",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    stats: "minimal",
    overlay: true,
    historyApiFallback: true
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: "public/index.html"
      // favicon: "public/favicon.ico"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true // webpack@2.x and newer
            }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"]
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  }
};
