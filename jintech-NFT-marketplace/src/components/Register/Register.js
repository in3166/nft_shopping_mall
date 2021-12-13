import React, { useState, useEffect, useReducer, useRef } from "react";
import classes from "./Register.module.css";
import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import axios from "axios";

import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { useHistory } from "react-router-dom";
import useInput from "../../hooks/useInputreduce";

const passwordValidator = (value) => value.trim().length > 5;
const regEmail =
  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const emailValidator = (value) => regEmail.test(value);

const Register = () => {
  //const [formIsValid, setFormIsValid] = useState(false);

  const {
    value: enteredEmail,
    valueIsValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    valueBlurHandler: emailBlurHandler,
    reset: resetEmail,
    inputRef: emailInputRef,
  } = useInput(emailValidator);

  const {
    value: enteredFirstPassword,
    valueIsValid: firstPasswordIsValid,
    hasError: firstPasswordHasError,
    valueChangeHandler: firstPasswordChangeHandler,
    valueBlurHandler: firstPasswordBlurHandler,
    reset: resetFirstPassword,
    inputRef: firstPasswordInputRef,
  } = useInput(passwordValidator);

  const {
    value: enteredSecondPassword,
    valueIsValid: secondPasswordIsValid,
    hasError: secondPasswordHasError,
    valueChangeHandler: secondPasswordChangeHandler,
    valueBlurHandler: secondPasswordBlurHandler,
    reset: resetSecondPassword,
    inputRef: secondPasswordInputRef,
  } = useInput(passwordValidator);

  const [address, setaddress] = useState("");

  // const emailInputRef = useRef();
  // const firstPasswordInputRef = useRef();
  // const secondPasswordInputRef = useRef();

  const getAccount = async () => {
    const accounts = await window.web3.eth.getAccounts();
    console.log("accounts: ", accounts);
    setaddress(accounts[0]);
  };

  useEffect(() => {
    getAccount();
  }, []);

  const formIsValid =
    emailIsValid && firstPasswordIsValid && secondPasswordIsValid;

  // useEffect(() => {
  //   const identifier = setTimeout(() => {
  //     setFormIsValid(emailIsValid && firstPasswordIsValid && secondPasswordIsValid);
  //   }, 500);

  //   return () => {
  //     clearTimeout(identifier);
  //   };
  // }, [emailIsValid, firstPasswordIsValid, secondPasswordIsValid]);

  // 경고창 띄우기
  const [openSnack, setOpen] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const [severity, setseverity] = useState("success");
  const [message, setmessage] = useState("");

  const snackbarHandler = (open, severity, message) => {
    setOpen((pre) => {
      return { open: open, vertical: pre.vertical, horizontal: pre.horizontal };
    });
    setseverity(severity);
    setmessage(message);
  };

  const snackbarHandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen({
      open: false,
      vertical: "top",
      horizontal: "center",
    });
  };

  const history = useHistory();

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      if (enteredFirstPassword === enteredSecondPassword) {
        const body = {
          email: enteredEmail,
          password: enteredFirstPassword,
          address: address,
        };

        axios
          .post("/api/users", body)
          .then(() => {
            snackbarHandler(
              true,
              "success",
              "가입을 완료했습니다.\n이메일 인증을 완료하세요."
            );
            setTimeout(() => {
              history.push("/login");
            }, 2500);
          })
          .catch((err) => {
            console.log(err.response.data);
            emailInputRef.current.focus();
            snackbarHandler(true, "error", err.response.data.message);
          });
      } else {
        snackbarHandler(true, "warning", "비밀번호가 다릅니다.");
        secondPasswordInputRef.current.focus();
      }
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
      snackbarHandler(true, "warning", "E-Mail을 입력하세요.");
    } else if (!firstPasswordIsValid) {
      firstPasswordInputRef.current.focus();
      snackbarHandler(true, "warning", "비밀번호를 6글자 이상 입력하세요.");
    } else {
      secondPasswordInputRef.current.focus();
      snackbarHandler(true, "warning", "비밀번호를 6글자 이상 입력하세요.");
    }
  };

  const { open, vertical, horizontal } = openSnack;

  return (
    <Card className={classes.register}>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical, horizontal }}
        onClose={snackbarHandleClose}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={snackbarHandleClose}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message?.split("\n").map((v) => (
            <div key={v}>{v}</div>
          ))}
        </Alert>
      </Snackbar>

      <form onSubmit={submitHandler}>
        <Input
          id="email"
          label="E-Mail"
          type="email"
          isValid={emailHasError}
          value={enteredEmail}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          ref={emailInputRef}
          message="이메일 형식이 아닙니다."
        />

        <Input
          ref={firstPasswordInputRef}
          id="password"
          label="Password"
          type="password"
          isValid={firstPasswordHasError}
          value={enteredFirstPassword}
          onChange={firstPasswordChangeHandler}
          onBlur={firstPasswordBlurHandler}
          message="비밀번호를 6자리 이상 입력하세요."
        />

        <Input
          ref={secondPasswordInputRef}
          id="password2"
          label="Check Password"
          type="password"
          isValid={secondPasswordHasError}
          value={enteredSecondPassword}
          onChange={secondPasswordChangeHandler}
          onBlur={secondPasswordBlurHandler}
          message="비밀번호를 6자리 이상 입력하세요."
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Register
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Register;
