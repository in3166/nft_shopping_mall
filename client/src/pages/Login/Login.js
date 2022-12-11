import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

import {
  loginAction,
  otpConfirmAction,
} from "../../store/actions/user-action";
import Card from "../../components/Card/Card";
import styles from "./Login.module.css";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tempUser, setTempUser] = useState({});
  const [token, setToken] = useState({});
  const [useOtp, setUseOtp] = useState(false);
  const [otpCodeInput, setOtpCodeInput] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
        if(!!res.email){
          alert(t("Login.verify-email"));
          return;
        }
        alert(t("Login.alert"));
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
    <Card className={styles["login-card"]}>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit} className={styles["login-form"]}>
        <label>{t("Login.email")}</label>
        <input
          type="text"
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>{t("Login.password")}</label>
        <input
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>

        <div>
          <Button type="submit" variant="outlined">
            {t("Login.signin")}
          </Button>
        </div>
      </form>

      <Link to="/register" className={styles.register}>
        {" "}
        {t("Login.signup")}
      </Link>

      {useOtp && (
        <Dialog
          open={useOtp}
          onClose={() => {
            setUseOtp(false);
          }}
        >
          <DialogTitle>OTP</DialogTitle>
          <DialogContent>
            <DialogContentText>{t("Login.otp")}</DialogContentText>
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
              {t("Login.cancel")}
            </Button>
            <Button onClick={otpConfrimHandler}>{t("Login.ok")}</Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
};

export default Login;
