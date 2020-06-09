// 高阶组件
import React, { Component } from "react";

export default function WithMouse(Components) {
  class Mouse extends Component {
    state = {
      x: null,
      y: null,
    };
    mousemove = (e) => {
      this.setState({
        x: e.clientX,
        y: e.clientY,
      });
    };

    componentDidMount() {
      window.addEventListener("mousemove", this.mousemove);
    }

    componentWillUnmount() {
      window.removeEventListener("mousemove", this.mousemove);
    }

    render() {
      return <Components {...this.props} {...this.state} />;
    }
  }

  return Mouse;
}
