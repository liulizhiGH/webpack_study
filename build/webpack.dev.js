const merge = require("webpack-merge");
const common = require("./webpack.common");
const path = require("path");
//测试，感觉在dev环境下使用clean-webpack-plugin没有意义

module.exports = merge(common, {
  mode: "development",
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"), //这句话"一定要写"，设置webpack-dev-server以此做为静态文件服务器目录，这样就能够"同时使用"内存中的动态文件和dist目录中的真实文件了
    port: 3000,
    open: true,
    hot: true, //开启hmr热替换
    historyApiFallback: true //使用react-router中的BrowzerRouter时，一定要开启
  }
});
