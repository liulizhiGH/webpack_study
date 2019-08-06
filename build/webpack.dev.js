const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Happypack = require("happypack");
const os = require("os");
const happypackThreadPool = Happypack.ThreadPool({ size: os.cpus().length });

module.exports = {
  context: path.resolve(__dirname, "../"),
  mode: "development",
  devtool: "source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"), //这句话"一定要写"，设置webpack-dev-server以此做为静态文件服务器目录，这样就能够"同时使用"内存中的动态文件和dist目录中的真实文件了
    port: 3000,
    open: true,
    hot: true, //开启hmr热替换
    historyApiFallback: true //使用react-router中的BrowzerRouter时，一定要开启
  },
  entry: {
    index: ["./src/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[hash:8].js", //hash是工程级别的，一个文件修改，所有文件的hash全部重新编译
    chunkFilename: "chunk.[name].[chunkhash:8].js" //chunkhash是文件级别的，一个文件修改，自身和相关文件的hash重新编译（注：另一个是contenthash,是内容级别的,比前两个影响范围更细更小,只会自身的hash重新编译）
  },
  // 拆包
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
        test: /\.(js||jsx)$/,
        use: [
          {
            loader: "happypack/loader?id=happyBabel"
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
            loader: "happypack/loader?id=happyLess"
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
    // 分包
    new Webpack.DllReferencePlugin({
      manifest: require("../dist/vendor-manifest.json") //引入DllPluginc插件生成的manifestjson文件
    }),
    new Happypack({
      id: "happyBabel",
      loaders: [
        {
          loader: "babel-loader",
          options: {
            cacheDirectory: true
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
      id: "happyLess",
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
