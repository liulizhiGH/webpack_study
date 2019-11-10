import React, { Component } from "react";
import "./style.less";
import  moment from 'moment'

export default class index extends Component {
  render() {
    return (
      <div id="about">
        关于我们
        <h1>welcome dev修改{moment().format("YYYY-MM-DD")}</h1>
      </div>
    );
  }
}
