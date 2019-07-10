const merge = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool:"source-map",
  devServer: {
    port: 3000,
    open: true,
    hot:true,
  }
}) 
