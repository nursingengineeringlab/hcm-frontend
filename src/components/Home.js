import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./Home.css"

class Home extends Component {
  render() {
    return (
      <div class="jumbotron d-flex align-items-center min-vh-100">
      <Container className="text-center">
        <h1>Umass NE Lab HMS</h1>
        <h3>
          <Link to="/login/">Login</Link>
        </h3>
        <h3>
          <Link to="/signup">Sign up</Link>
        </h3>
        <h3>
          <Link to="/dashboard">Dashboard</Link>
        </h3>
      </Container>
      </div>
    );
  }
}

export default Home;
