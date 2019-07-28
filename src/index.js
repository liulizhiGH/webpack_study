import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
// 开启热替换，必须写此段代码，并且devServer中配置hot:true----------
if (module.hot) {
  module.hot.accept();
}
// ----------------------------------

ReactDOM.render(<Home />, document.getElementById("root"));
