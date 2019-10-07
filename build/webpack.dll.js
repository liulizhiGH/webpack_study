const path = require("path");
const Webpack = require("webpack");

module.exports = {
  context: path.resolve(__dirname, "../"), //以下所有相对路径都是相对于context字段
  mode: "production",
  entry: {
    vendor: ["react", "react-dom", "react-router-dom"] //"vendor"名字随意
  },
  output: {
    path: path.resolve(__dirname, "../dist/js/dll"),
    filename: "dll.[name].js", //name就是entry中的名字（此处即为上文的"vender"）
    library: "[name]_library" //给生成的动态库起一个标识名
  },
  plugins: [
    // 利用webpack自带的DllPlugin生成mainfestjson文件
    new Webpack.DllPlugin({
      path: path.resolve(__dirname, "../dist/[name]-manifest.json"), //生成链接库的mainfestjson文件（name即entry中的名字（"vender"），内容就是,介绍链接库中各个文件的对应依赖映射等的关系类似source-map）
      name: "[name]_library" //与上面的配置的动态链接库标识名必须一致
    })
  ]
};
