// 尽量使用绝对路径
const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 多线程编译打包
const Happypack = require("happypack");
const os = require("os");
const happypackThreadPool = Happypack.ThreadPool({ size: os.cpus().length });
// ---------------------------------------------------------------
// 单独配置css提取，并压缩
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCss = require("optimize-css-assets-webpack-plugin");

// 生产环境下使用hash，压缩js代码，提取并压缩css文件，（生产环境默认打包压缩js，所以css需要单独引入压缩插件，并单独配置）
module.exports = {
  mode: "production",
  entry: {
    index: [path.resolve(__dirname, "../src/index.js")],
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "", // 一般不使用cdn资源可以不配置，即默认就是空字符串
    filename: "./js/[name].[chunkhash:8].js", // hash是工程级别的，一个文件修改，所有文件的hash全部重新编译
    chunkFilename: "./js/chunk.[name].[chunkhash:8].js", // chunkhash是文件级别的，一个文件修改，自身和相关文件的hash重新编译（注：另一个是contenthash,是内容级别的,比前两个影响范围更细更小,只会自身的hash重新编译，但需要自身插件支持，并且需要在相应插件中设置）
  },
  // 拆包（提取每个文件中重复引用的代码部分到一个文件中）
  // wp4新增字段
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: {
      name: "runtime-manifest", // 生成运行时manifestjs文件（即模块间的依赖地图）
    },
  },
  module: {
    // loaders的执行顺序为从右至左，即从下到上
    // happypack接管的loader下，不可以有option字段
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: "happypack/loader?id=happyJS",
            // 此处不可有option选项
          },
        ],
        include: /src/, // 必须是绝对路径或正则表达式
        exclude: /node_modules/, //必须是绝对路径或正则表达式
      },
      {
        test: /\.(css)$/,
        use: [
          // 特别注意，不可使用happypack接管mini-css-extract-plugin组件的loader，不然会报错误，所以依然保留MiniCssExtractPlugin.loader，并且style-loader和mini-css-extract-plugin互相冲突，不可同时使用（一般这两者分属开发和生产环境）
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../", //打包后css文件夹和images文件夹的相对位置决定此值
            },
          },
          {
            loader: "happypack/loader?id=happyCSS",
          },
        ],
      },
      {
        test: /\.(less)$/,
        use: [
          // 特别注意，不可使用happypack接管mini-css-extract-plugin组件的loader，不然会报错误，所以依然保留MiniCssExtractPlugin.loader，并且生产环境不使用style-loader，并且style-loader和mini-css-extract-plugin一起使用会冲突
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../", //打包后css文件夹和images文件夹的相对位置决定此值
            },
          },
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
              outputPath: "./images", //相对路径，相对于output中的path
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
    //引入DllPluginc插件生成的manifestjson文件,可以不使用require，可以只是一个路径
    new Webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "../dist/js/dll/vendor-manifest.json"),
    }),
    // 提取css,路径相对于output.path
    new MiniCssExtractPlugin({
      filename: "./css/[name].[contenthash:8].css",
      chunkFilename: "./css/chunk.[name].[contenthash:8].css", //插件提供的内容级别的hash
    }),
    // 压缩css
    new OptimizeCss({}),
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
        // 切记先使用eslint-laoder校验我们的原始js代码
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
          loader: "css-loader",
        },
        {
          loader: "less-loader",
          options: {
            javascriptEnabled: true, //必须设置，antd组件按需加载
          },
        },
      ],
      threadPool: happypackThreadPool,
      verbose: true,
    }),
  ],
};
