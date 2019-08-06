import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

//------------------------------------
// 开启热替换，必须写此段代码，位置随意。并且devServer中需要配置hot:true
if (module.hot) {
  module.hot.accept();
}
// -----------------------------------

ReactDOM.render(<div><Home /><About/></div>, document.getElementById("root"));
