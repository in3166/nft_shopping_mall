import React, { useState } from "react";
import "./Login.css";

//session 을 위한 추가 당장은 필요 없는 듯
import { Link, useHistory } from "react-router-dom";
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
import { useDispatch } from "react-redux";
import { loginAction, otpConfirmAction } from "../../store/actions/user-action";
import { userAction } from "../../store/reducers/user-slice";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tempUser, setTempUser] = useState({});
  const [token, setToken] = useState({});
  const [useOtp, setUseOtp] = useState(false);
  const [otpCodeInput, setOtpCodeInput] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();

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

    dispatch(loginAction(body)).then((res) => {
      console.log("res: ", res);
      if (res?.error) {
        alert(res.message);
        return;
      }
      if (res.success) {
        if (!res.otp) {
          history.replace("/");
        } else {
          setTempUser(res.data.user);
          setToken(res.data.token);
          setUseOtp(true);
        }
      } else {
        alert(res.message);
      }
    });
  };

  const otpConfrimHandler = () => {
    const body = {
      code: otpCodeInput,
      user: tempUser,
      token: token,
    };

    console.log(body);

    dispatch(otpConfirmAction(body)).then((res) => {
      console.log(res);
      if (res?.error) {
        alert(res.message);
        return;
      }
      
      if (res?.success) {
        history.replace("/");
      } else {
        alert(res.message);
      }
    });
  };

  return (
    <Card className="login-card">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label>E-Mail</label>
        <input
          type="text"
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Password</label>
        <input
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
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
      {useOtp && (
        <Dialog
          open={useOtp}
          onClose={() => {
            setUseOtp(false);
          }}
        >
          <DialogTitle>OTP</DialogTitle>
          <DialogContent>
            <DialogContentText>OTP 번호 6자리를 입력하세요.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="code"
              onChange={(e) => {
                setOtpCodeInput(e.target.value);
              }}
              value={otpCodeInput}
              label="OTP Code"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setUseOtp(false);
              }}
            >
              취소
            </Button>
            <Button onClick={otpConfrimHandler}>확인</Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
};

export default Login;
