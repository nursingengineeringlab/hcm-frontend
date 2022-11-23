import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import { login, getToken } from "./LoginActions.js";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      token: ""
    };
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onLoginClick = () => {
    const userData = {
      email: this.state.email,
      token: this.state.token
    };
    this.props.login(userData, "/dashboard");
  };

  onGetTokenClick = () => {
    const userData = {
      email: this.state.email
    };
    this.props.getToken(userData);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col md="4">
            <h1>Login</h1>
            <Form>
              <Form.Group controlId="usernameId">
                <Form.Label>Email address: </Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  placeholder="example@umass.edu"
                  value={this.state.email}
                  onChange={this.onChange}
                />
                
              </Form.Group>
              <Button color="primary" onClick={this.onGetTokenClick}>
                  Get Token
                </Button>
              <Form.Group controlId="passwordId">
                <Form.Label>Login Token:</Form.Label>
                <Form.Control
                  type="text"
                  name="token"
                  placeholder="123456"
                  value={this.state.token}
                  onChange={this.onChange}
                />
                
              </Form.Group>
            </Form>
            <Button color="primary" onClick={this.onLoginClick}>
                  Login
                </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

//export default Login;
Login.propTypes = {
  login: PropTypes.func.isRequired,
  getToken: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  login,
  getToken
})(withRouter(Login));
