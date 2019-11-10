const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Happypack = require("happypack");
const os = require("os");
const happypackThreadPool = Happypack.ThreadPool({ size: os.cpus().length });
// ---------------------------------------------------------------
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCss = require("optimize-css-assets-webpack-plugin");

//生产环境下使用hash，压缩js代码，提取并压缩css文件
module.exports = {
  mode: "production",
  context: path.resolve(__dirname, "../"), //以下所有相对路径都是相对于context字段
  entry: {
    index: ["./src/index.js"] //如果文件名是index.js，就可以省略不写，即"./src"
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/", // 设置好公共路径，以便解决css中引入图片字体文件等的路径问题
    filename: "js/[name].[chunkhash:8].js", //hash是工程级别的，一个文件修改，所有文件的hash全部重新编译
    chunkFilename: "js/chunk.[name].[chunkhash:8].js" //chunkhash是文件级别的，一个文件修改，自身和相关文件的hash重新编译（注：另一个是contenthash,是内容级别的,比前两个影响范围更细更小,只会自身的hash重新编译，但需要相应插件支持，并且需要在相应插件中设置）
  },
  // 拆包（即提取代码中重复引用部分）
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    runtimeChunk: {
      name: "runtime-manifest" // 生成运行时manifestjs文件（即模块间的依赖地图）
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: "happypack/loader?id=happyJS"
          }
        ],
        include: /src/, //必须是绝对路径或正则表达式
        exclude: /node_modules/ //必须是绝对路径或正则表达式
      },
      {
        test: /\.(css)$/,
        use: [
          // 特别注意，不使用happypack接管mini-css-extract-plugin组件的loader，不然会报错误，所以依然保留MiniCssExtractPlugin.loader
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "happypack/loader?id=happyCSS"
          }
        ]
      },
      {
        test: /\.(less)$/,
        use: [
          // 特别注意，不使用happypack接管mini-css-extract-plugin组件的loader，不然会报错误，所以依然保留MiniCssExtractPlugin.loader
          {
            loader: MiniCssExtractPlugin.loader
          },
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
              outputPath: "images" //相对路径，相对于context中设置的路径，其他loader同理
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
    // 提取和压缩css
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/chunk.[name].[contenthash:8].css" //插件提供的内容级别的hash
    }),
    new OptimizeCss({}),
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
