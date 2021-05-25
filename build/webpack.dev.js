// 尽量使用绝对路径
const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 多线程编译打包
const Happypack = require("happypack");
const os = require("os");
const happypackThreadPool = Happypack.ThreadPool({ size: os.cpus().length });

// 开发环境下不使用任何hash（生产环境才需要hash），不压缩js代码，不提取和压缩css文件
module.exports = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"), //这句话"一定要写"，设置webpack-dev-server以此做为静态文件服务器目录，这样就能够"同时使用"内存中的动态文件和dist目录中的真实文件了
    port: 3000,
    open: true,
    hot: true, //开启hmr热替换(👍)
    historyApiFallback: true, //使用react-router-dom中的BrowzerRouter时，一定要开启
  },
  entry: {
    index: [path.resolve(__dirname, "../src/index.js")],
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "", // 不使用cdn资源可以不配置，即默认就是空字符串
    filename: "./js/[name].js", // hash是工程级别的，一个文件修改，所有文件的hash全部重新编译
    chunkFilename: "./js/chunk.[name].js", // chunkhash是文件级别的，一个文件修改，自身和相关文件的hash重新编译（注：另一个是contenthash,是内容级别的,比前两个影响范围更细更小,只会自身的hash重新编译，但需要相应插件支持，并且需要在相应插件中设置）
  },
  // 拆包（把每个文件中重复引用的代码部分提取到一个文件）
  // wp4新增字段
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: {
      name: "runtime-manifest", // 生成供webpack使用的运行时的manifestjs文件（即模块间的依赖地图）
    },
  },
  module: {
    // 使用happypack接管的loader，其下面不可以有option字段选项
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: "happypack/loader?id=happyJS",
            // 此处不可以有option选项
          },
        ],
        include: /src/, //必须是绝对路径或正则表达式
        exclude: /node_modules/, //必须是绝对路径或正则表达式
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: "happypack/loader?id=happyCSS",
          },
        ],
      },
      {
        test: /\.(less)$/,
        use: [
          {
            loader: "happypack/loader?id=happyLESS",
          },
        ],
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              outputPath: "./images", //相对路径，相对于output中的path，其他loader同理
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 分包（即提取公共第三方代码库等）
    // 引入DllPluginc插件生成的manifestjson文件,可以不使用require，可以只是一个路径
    new Webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "../dist/js/dll/vendor-manifest.json"),
    }),
    // 多线程编译，id即对应标识，loaders即和module中的use字段用法一致，threadPool即用几线程
    new Happypack({
      id: "happyJS",
      loaders: [
        {
          loader: "babel-loader",
          options: {
            cacheDirectory: true, // 开启babel-loader的编译缓存，加快重新编译速度
          },
        },
        // 切记先使用eslint-loader校验我们的原始js代码
        {
          loader: "eslint-loader",
          options: {
            cache: true,
          },
        },
      ],
      threadPool: happypackThreadPool,
      verbose: true,
    }),
    new Happypack({
      id: "happyCSS",
      loaders: [
        {
          loader: "style-loader",
        },
        {
          loader: "css-loader",
        },
      ],
      threadPool: happypackThreadPool,
      verbose: true,
    }),
    new Happypack({
      id: "happyLESS",
      loaders: [
        {
          loader: "style-loader",
        },
        {
          loader: "css-loader",
        },
        {
          loader: "less-loader",
          options: {
            javascriptEnabled: true, // 必须设置，antd组件按需加载
          },
        },
      ],
      threadPool: happypackThreadPool,
      verbose: true,
    }),
  ],
};
