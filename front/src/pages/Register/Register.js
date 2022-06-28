import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import { Alert, LinearProgress, Stack } from "@mui/material";

import useInput from "../../hooks/useInputreduce";
import Card from "../../components/Card/Card";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import classes from "./Register.module.css";

const passwordValidator = (value) => value.trim().length > 5;
const regEmail =
  /^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,sd3}$/;
const emailValidator = (value) => regEmail.test(value);

const Register = () => {
  const { t } = useTranslation();
  const {
    value: enteredEmail,
    valueIsValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    valueBlurHandler: emailBlurHandler,
    inputRef: emailInputRef,
  } = useInput(emailValidator);

  const {
    value: enteredFirstPassword,
    valueIsValid: firstPasswordIsValid,
    hasError: firstPasswordHasError,
    valueChangeHandler: firstPasswordChangeHandler,
    valueBlurHandler: firstPasswordBlurHandler,
    inputRef: firstPasswordInputRef,
  } = useInput(passwordValidator);

  const {
    value: enteredSecondPassword,
    valueIsValid: secondPasswordIsValid,
    hasError: secondPasswordHasError,
    valueChangeHandler: secondPasswordChangeHandler,
    valueBlurHandler: secondPasswordBlurHandler,
    inputRef: secondPasswordInputRef,
  } = useInput(passwordValidator);

  const [address, setaddress] = useState("");
  const [Loading, setLoading] = useState(false);


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

  const submitHandler = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      if (formIsValid) {
        if (enteredFirstPassword === enteredSecondPassword) {
          const body = {
            email: enteredEmail,
            password: enteredFirstPassword,
            address: address,
          };
          console.log(body, "body");
          await axios
            .post("/api/users", body)
            .then(() => {
              snackbarHandler(true, "success", t("Register.message-success"));
              setTimeout(() => {
                history.push("/login");
              }, 2000);
            })
            .catch((err) => {
              console.log(err.response.data);
              emailInputRef.current.focus();
              snackbarHandler(true, "error", err.response.data.message);
            });
        } else {
          snackbarHandler(
            true,
            "warning",
            t("Register.message-different-password")
          );
          secondPasswordInputRef.current.focus();
        }
      } else if (!emailIsValid) {
        emailInputRef.current.focus();
        snackbarHandler(true, "warning", t("Register.message-valid-email"));
      } else if (!firstPasswordIsValid) {
        firstPasswordInputRef.current.focus();
        snackbarHandler(true, "warning", t("Register.message-valid-password"));
      } else {
        secondPasswordInputRef.current.focus();
        snackbarHandler(true, "warning", t("Register.message-valid-password"));
      }
    } catch (error) {
      snackbarHandler(true, "error", error.response.data.message);
    } finally {
      setLoading(false);
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

      {Loading && (
        <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
          {/* <CircularProgress color="inherit" /> */}
          <LinearProgress color="inherit" />
        </Stack>
      )}

      <form onSubmit={submitHandler}>
        <Input
          id="email"
          label={t("Register.email")}
          type="email"
          isValid={emailHasError}
          value={enteredEmail}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          ref={emailInputRef}
          message={t("Register.input-message-email")}
          autoComplete="username"
        />

        <Input
          ref={firstPasswordInputRef}
          id="password"
          label={t("Register.password")}
          type="password"
          isValid={firstPasswordHasError}
          value={enteredFirstPassword}
          onChange={firstPasswordChangeHandler}
          onBlur={firstPasswordBlurHandler}
          message={t("Register.input-message-password")}
          autoComplete="new-password"
        />

        <Input
          ref={secondPasswordInputRef}
          id="password2"
          label={t("Register.check-password")}
          type="password"
          isValid={secondPasswordHasError}
          value={enteredSecondPassword}
          onChange={secondPasswordChangeHandler}
          onBlur={secondPasswordBlurHandler}
          message={t("Register.input-message-password")}
          autoComplete="new-password"
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            {t("Register.signup")}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Register;
