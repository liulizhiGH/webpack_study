import React, { Component } from "react";
import "./style.less";
import testImg from "../../assets/testImg.png";
// 使用高阶组件
import WithMouse from "../HOC";

const kkk=async ()=>{
  const res=await fetch();
  console.log(res)
}
class Home extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  componentDidMount() {
    kkk();
  }
  
  render() {
    console.log(this.props,"this.props")
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

export default WithMouse(Home);
