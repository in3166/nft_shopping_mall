import React, { Component } from "react";
import "./Login.css";

//session 을 위한 추가 당장은 필요 없는 듯
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import Card from "../UI/Card/Card";
import axios from "axios";
import AuthContext from "../../store/auth-context";

class Login extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  //로그인 토큰 저장하기 update 2021-11-15
  setToken(userToken) {
    sessionStorage.setItem("nft_user_token", JSON.stringify(userToken));
  }

  // async loginUser(credentials) {
  //   return fetch("http://52.78.70.151:3333/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(credentials),
  //   }).then((data) => data.json());
  // }

  render() {
    var token = this.props.setToken;
    var email = this.state.email;
    var password = this.state.password;
    const { history } = this.props;

    const handleSubmit = async (e) => {
      e.preventDefault();
      let token = localStorage.getItem('nft_token');
      console.log('token ', token)
      token = JSON.parse(token);

      const body = {
        email,
        password,
        token: token?.accessToken
      };

      axios
        .post("/api/users/login", body)
        .then((res) => {
          console.log('res: ',res);
          if (res.data.success) {
            alert("로그인 성공");
            console.log(res.data.user);
            this.context.login(res.data.user);
            history.replace("/");
          } else {
            alert(`로그인 실패: ${res.data.message}`);
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err.response)
          alert(`로그인 실패: ${err.response.data}\n${err.response.data.message}`);
        });

      // token = await this.loginUser({
      //   email,
      //   password,
      // });

      // console.log("login token?: ", token);
      // this.setToken(token);

      // history.push("/");
      //window.location.href = "/";
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
          <br />
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
