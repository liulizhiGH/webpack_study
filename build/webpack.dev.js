const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 多线程编译打包
const Happypack = require("happypack");
const os = require("os");
const happypackThreadPool = Happypack.ThreadPool({ size: os.cpus().length });

//开发环境下不使用任何hash（生产环境才需要hash），不js代码压缩，不css文件提取
module.exports = {
  mode: "development",
  context: path.resolve(__dirname, "../"), //以下所有相对路径都是相对于context字段
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"), //这句话"一定要写"，设置webpack-dev-server以此做为静态文件服务器目录，这样就能够"同时使用"内存中的动态文件和dist目录中的真实文件了
    port: 3000,
    open: true,
    hot: true, //开启hmr热替换
    historyApiFallback: true //使用react-router中的BrowzerRouter时，一定要开启
  },
  entry: {
    index: ["./src/index.js"] //如果文件名是index.js，就可以省略不写，即"./src"
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/", // 设置好公共路径，以便解决css中引入图片字体文件等的路径问题
    filename: "./js/[name].js", //hash是工程级别的，一个文件修改，所有文件的hash全部重新编译
    chunkFilename: "./js/chunk.[name].js" //chunkhash是文件级别的，一个文件修改，自身和相关文件的hash重新编译（注：另一个是contenthash,是内容级别的,比前两个影响范围更细更小,只会自身的hash重新编译，但需要相应插件支持，并且需要在相应插件中设置）
  },
  // 拆包（把每个文件中重复引用的代码部分提取到一个文件）
  // wp4新增字段
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    runtimeChunk: {
      name: "runtime-manifest" // 生成运行时manifestjs文件（即模块间的依赖地图）
    }
  },
  module: {
    // loaders的执行顺序依次为从右到左，即从下到上
    // 使用happypack接管的loader，其下面不可以有option字段选项
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: "happypack/loader?id=happyJS"
            // 此处不可以有option选项,因为happypack不识别，可以在下面happypack配置中配置option选项
          }
        ],
        include: /src/, //必须是绝对路径或正则表达式
        exclude: /node_modules/ //必须是绝对路径或正则表达式
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: "happypack/loader?id=happyCSS"
          }
        ]
      },
      {
        test: /\.(less)$/,
        use: [
          {
            loader: "happypack/loader?id=happyLESS"
          }
        ]
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              outputPath: "./images" //相对路径，相对于context中设置的路径，其他loader同理
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    // 分包（即提取公共第三方代码库等）
    //引入DllPluginc插件生成的manifestjson文件,可以不使用require，可以只是一个路径
    new Webpack.DllReferencePlugin({
      manifest: "./dist/js/dll/vendor-manifest.json"
    }),
    // 多线程编译，id即对应标识，loaders即和module中的use字段用法一致，threadPool即用几线程
    new Happypack({
      id: "happyJS",
      loaders: [
        {
          loader: "babel-loader",
          options: {
            cacheDirectory: true // 开启babel-loader的编译缓存，加快重新编译速度
          }
        }
      ],
      threadPool: happypackThreadPool,
      verbose: true
    }),
    new Happypack({
      id: "happyCSS",
      loaders: [
        {
          loader: "style-loader"
        },
        {
          loader: "css-loader"
        }
      ],
      threadPool: happypackThreadPool,
      verbose: true
    }),
    new Happypack({
      id: "happyLESS",
      loaders: [
        {
          loader: "style-loader"
        },
        {
          loader: "css-loader"
        },
        {
          loader: "less-loader",
          options: {
            javascriptEnabled: true //必须设置，antd组件按需加载
          }
        }
      ],
      threadPool: happypackThreadPool,
      verbose: true
    })
  ]
};
