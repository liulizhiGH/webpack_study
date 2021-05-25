// 此文件为整个项目的入口文件，webpack构建亦是从文件此开始
import React from "react";
import ReactDOM from "react-dom";
import "./index.less";
import RootRouter from "./route/rootRouter";

ReactDOM.render(<RootRouter />, document.getElementById("root"));
