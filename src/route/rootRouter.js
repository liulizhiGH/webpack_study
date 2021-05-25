import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Concat from "../pages/Concat";

const rootRouter = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/about" component={About}>
          <About />
        </Route>
        <Route path="/concat" component={Concat}>
          <Concat />
        </Route>
        <Route path="/" component={Home}>
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default rootRouter;
