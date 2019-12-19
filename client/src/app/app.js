import React, { Component } from "react";
import { render } from "react-dom";
import { connect } from "react-redux";

import store from "./store/index";
import { authorize, logout } from "./store/auth"
import { Provider } from "react-redux";

import Layout from "./components/_layout";
import Index from "./components/index";

import "bootstrap";
import $ from "jquery";
window.jQuery = $;
window.$ = $;

// TODO: take care of auth here
// return Login or Editore depending on login state

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Layout>
          <Index />
        </Layout>
      </Provider>
    );
  }
}

render(<App />, document.getElementById("app"));
