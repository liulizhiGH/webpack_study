const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCss = require("optimize-css-assets-webpack-plugin");
const Happypack = require("happypack");
const os = require("os");
const happypackThreadPool = Happypack.ThreadPool({ size: os.cpus().length });

module.exports = {
  context: path.resolve(__dirname, "../"), //以下所有相对路径都是相对于context字段
  mode: "production",
  entry: {
    index: ["./src/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "./js/[name].[hash].js", //hash是工程级别的，一个文件修改，所有文件的hash全部重新编译
    chunkFilename: "./js/chunk.[name].[chunkhash:8].js" //chunkhash是文件级别的，一个文件修改，自身和相关文件的hash重新编译（注：另一个是contenthash,是内容级别的,比前两个影响范围更细更小,只会自身的hash重新编译）
  },
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
    new Webpack.DllReferencePlugin({
      manifest: require("../dist/vendor-manifest.json") //引入DllPluginc插件生成的manifestjson文件
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
      chunkFilename: "css/chunk.[name].[contenthash:8].css"
    }),
    new OptimizeCss({}),
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
