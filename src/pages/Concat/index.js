import React, { useState, useEffect } from "react";
import "./style.less";

const Myhooks = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `你点击了${count}次数！`;
  }, []);
  return (
    <div>
      <h1>点击了{count}次数</h1>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        click!!!
      </button>
    </div>
  );
};

export default Myhooks;
