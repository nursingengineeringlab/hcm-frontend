// import logo from './umass.svg';
import './App.css';
import React, { Component } from "react";
import Root from "./Root";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Dashboard from './components/Dashboard/Dashboard'
import requireAuth from "./utils/RequireAuth";
import axios from "axios";
import {http_public_url} from "./config.js"


axios.defaults.baseURL = http_public_url
// axios.defaults.headers["Authorization"] = token ? `Token ${token}` : null


class App extends Component {
  render() {
    return (
      <div>
        <Root>
          <ToastContainer hideProgressBar={true} newestOnTop={true} />
          <Switch>
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={requireAuth(Dashboard)} />
            <Route exact path="/" component={Home} />
          </Switch>
        </Root>
      </div>
    );
  }
}

export default App;
