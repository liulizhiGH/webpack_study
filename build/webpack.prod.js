const merge = require("webpack-merge");
const common = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCss = require("optimize-css-assets-webpack-plugin");
const Uglifyjs = require("uglifyjs-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimizer: [new Uglifyjs({}), new OptimizeCss({})],
    splitChunks: {
      chunks: "all"
    },
    runtimeChunk: {
      name: "runtime"
    }
  },
  module:{
    rules:[]
  }
});
