import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./Home.css"

class Home extends Component {
  render() {
    return (
      <Redirect to="/dashboard" />
    );
  }
}

export default Home;
