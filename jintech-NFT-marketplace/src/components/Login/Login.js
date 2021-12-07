import React, { Component } from "react";
import "./Login.css";

//session 을 위한 추가 당장은 필요 없는 듯
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import Card from "../UI/Card/Card";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }
  u;

  //로그인 토큰 저장하기 update 2021-11-15
  setToken(userToken) {
    sessionStorage.setItem("nft_user_token", JSON.stringify(userToken));
  }

  async loginUser(credentials) {
    return fetch("http://52.78.70.151:3333/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }).then((data) => data.json());
  }

  render() {
    var token = this.props.setToken;
    var email = this.state.email;
    var password = this.state.password;

    const handleSubmit = async (e) => {
      e.preventDefault();
      token = await this.loginUser({
        email,
        password,
      });
      
      console.log("login token?: ", token)
      this.setToken(token);
      window.location.href = "/";
    };
    return (
      <Card className="login-card">
        <h1>Log in</h1>
        <form onSubmit={handleSubmit} className="login-form">
              <label>Username</label>
            <input
              type="text"
              onChange={(e) => this.setState({ email: e.target.value })}
            />
            <br/>
            <label>Password</label>
            <input
              type="password"
              onChange={(e) => this.setState({ password: e.target.value })}
            ></input>
      
          <div>
            <Button type="submit" variant="outlined">
              Submit
            </Button>
          </div>
        </form>

        <Button type="button">
          <Link to="/register">Register</Link>
        </Button>
      </Card>
    );
  }
}

export default Login;
