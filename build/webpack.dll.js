const path = require("path");
const Webpack = require("webpack");

module.exports = {
  mode: "production",
  context: path.resolve(__dirname, "../"),
  entry: {
    vendor: ["react", "react-dom", "react-router-dom"] //名字随意
  },
  output: {
    path: path.resolve(__dirname, "../dist/js/dll"),
    filename: "dll.[name].js", //name就是entry中的名字
    library: "[name]_library" //给生成的动态库做个标识
  },
  plugins: [
    new Webpack.DllPlugin({
      path: path.resolve(__dirname, "../dist/[name]-manifest.json"), //生成链接库的mainfestjson文件（name即entry中的名字，内容就是介绍里链接库中各个文件的对应依赖映射等的关系类似source-map）
      name: "[name]_library" //与上面的配置的动态链接库标识必须一致
    })
  ]
};
