// 此文件为整个项目的入口文件，webpack构建亦是从此开始
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./index.less";
import Home from "./pages/Home";
import About from "./pages/About";
import Concat from "./pages/Concat";

//------------------------------------
// 开启热替换，必须写此段代码，位置随意。并且devServer中需要配置hot:true
if (module.hot) {
  module.hot.accept();
}
// -----------------------------------

ReactDOM.render(
  <div>
    <Home hhh={123} />
    <About />
    <Concat />
  </div>,
  document.getElementById("root")
);
