import React, { Component } from "react";
import "./style.less";
import testImg from "../../assets/testImg.png";

class Home extends Component {
  render() {
    return (
      <ul className="homestyle">
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
// 子类的原型=父类的实例，构成继承
let abc=new Home();
console.log(abc.__proto__===Home.prototype,"__proto__")
console.log(abc.__proto__.__proto__,"two")
console.log(abc.__proto__.__proto__.__proto__.constructor,"3")

export default Home;
