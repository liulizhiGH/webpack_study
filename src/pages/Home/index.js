import React, { Component } from "react";
import "../../style.less";
import testImg from "../../assets/testImg.png";

class Home extends Component {
  render() {
    return (
      <ul>
        <img src={testImg} />
        <li>这是home组件的内容</li>
        <li>这是home组件的内容</li>
        <li>这是home组件的内容</li>
        <li>这是home组件的内容</li>
        <li>这是home组件的内容</li>
        <li>哈哈哈hahah</li>
      </ul>
    );
  }
}

export default Home;
