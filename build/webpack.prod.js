const merge = require("webpack-merge");
const common = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCss = require("optimize-css-assets-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    runtimeChunk: {
      name: "runtime"
    }
  },
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.(less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
      chunkFilename: "css/chunk.[name].[contenthash:8].css"
    }),
    new OptimizeCss({})
  ]
});
