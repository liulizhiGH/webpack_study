const merge = require("webpack-merge");
const common = require("./webpack.common");

console.log(process.env.NODE_ENV)
module.exports = merge(common, {
  mode: "development",
  devServer: {
    port: 3000,
    open: true,
  }
}) 
