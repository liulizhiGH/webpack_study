/* eslint react/prop-types: 0 */
import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";
import "./style.less";

const { TextArea } = Input;

const Myhooks = (props) => {
  const [content, setContent] = useState();
  const [count, setCount] = useState();
  const { getFieldDecorator } = props.form;

  const handleSubmit = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        axios({
          method: "post",
          url: "http://localhost:4000/save",
          data: {
            all: values,
          },
        }).then((res) => {
          console.log(res.data.save);
          setCount(res.data.save);
        });
      }
    });
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="concat-form">
        {getFieldDecorator("save", {
          initialValue: "nihao",
        })(
          <TextArea
            className="yanjiu"
            placeholder="textarea with clear icon"
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        )}
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
      <div className="show">{content}</div>
      <div className="count">{count}</div>
    </>
  );
};

export default Form.create({
  onValuesChange(props, changedValues, allValues) {
    console.log(changedValues, "changedValues");
  },
})(Myhooks);
