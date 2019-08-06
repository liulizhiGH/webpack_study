const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCss = require("optimize-css-assets-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "../"),
  mode: "production",
  entry: {
    index: ["./src/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[hash].js", //hash是工程级别的，一个文件修改，所有文件的hash全部重新编译
    chunkFilename: "chunk.[name].[chunkhash:8].js" //chunkhash是文件级别的，一个文件修改，自身和相关文件的hash重新编译（注：另一个是contenthash,是内容级别的,比前两个影响范围更细更小,只会自身的hash重新编译）
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
            loader: "babel-loader"
          }
        ],
        include: /src/, //必须是绝对路径或正则表达式
        exclude: /node_modules/ //必须是绝对路径或正则表达式
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.(less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            }
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
    new OptimizeCss({})
  ]
};
