import React, { Component } from "react";
import "./Login.css";

//session 을 위한 추가 당장은 필요 없는 듯
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import Card from "../UI/Card/Card";
import axios from "axios";
import AuthContext from "../../store/auth-context";

class Login2 extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      tempUser: {},
      useOtp: false,
      otpCodeInput: "",
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
    //var token = this.props.setToken;
    var email = this.state.email;
    var password = this.state.password;
    const { history } = this.props;

    const handleSubmit = async (e) => {
      e.preventDefault();
      // let token = localStorage.getItem("nft_token");
      // console.log("token ", token);
      // token = JSON.parse(token);

      const body = {
        email,
        password,
        //token: token?.accessToken,
      };

      axios
        .post("/api/users/login", body)
        .then((res) => {
          console.log("res: ", res);
          if (res.data.success) {
            if (res.data.user.otp === "Y") {
              this.setState({ tempUser: res.data.user, useOtp: true });
            } else {
              // alert("로그인 성공");
              console.log(res.data.user);
              this.context.login(res.data.user);
              history.replace("/");
            }
          } else {
            alert(`로그인 실패: ${res.data.message}`);
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err.response);
          alert(
            `로그인 실패: ${err.response?.data}\n${err.response?.data.message}`
          );
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
            autoComplete="username"
            onChange={(e) => this.setState({ email: e.target.value })}
          />
          <br />
          <label>Password</label>
          <input
            type="password"
            autoComplete="current-password"
            onChange={(e) => this.setState({ password: e.target.value })}
          ></input>

          <div>
            <Button type="submit" variant="outlined">
              Sign in
            </Button>
          </div>
        </form>

        <Button type="button">
          <Link to="/register">Sign up</Link>
        </Button>
        {this.state.useOtp && (
          <Dialog
            open={this.state.useOtp}
            onClose={() => {
              this.setState({ useOtp: false });
            }}
          >
            <DialogTitle>OTP</DialogTitle>
            <DialogContent>
              <DialogContentText>
                OTP 번호 6자리를 입력하세요.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="code"
                onChange={(e) => {
                  this.setState((curState) => {
                    return { otpCodeInput: e.target.value };
                  });
                }}
                value={this.state.otpCodeInput}
                label="OTP Code"
                type="text"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  this.setState({ useOtp: false });
                }}
              >
                취소
              </Button>
              <Button
                onClick={() => {
                  const body = {
                    code: this.state.otpCodeInput,
                    email: this.state.tempUser.email,
                  };
                  console.log(body);
                  axios
                    .post("/api/auth/verify", body)
                    .then((res) => {
                      console.log(res);
                      if (res.data.verify) {
                        this.context.login(this.state.tempUser);
                        history.replace("/");
                      } else {
                        alert("코드가 틀립니다.");
                      }
                    })
                    .catch((err) => {
                      alert(err);
                    });
                }}
              >
                확인
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Card>
    );
  }
}

export default Login2;
