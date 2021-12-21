import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const UserForm = () => {
  const authCtx = useContext(AuthContext);
  const [passwordIsTouched, setpasswordIsTouched] = useState(false);
  const [loading, setloading] = useState(false);
  const [Balance, setBalance] = useState(0);
  const [User, setUser] = useState({
    email: "",
    address: "",
    auth: "",
    createdAt: "",
    password: "",
  });
  const [isMounted, setIsMounted] = useState(true);

  const getCurrentWalletAccount = async () => {
    setloading(true);
    const accounts = await window.web3.eth.getAccounts();
    formChangeHandler(accounts[0], "address");

    setTimeout(() => {
      if (isMounted) setloading(false);
    }, 500);
  };

  const getWalletInfo = useCallback(async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    let accountBalance = await web3.eth.getBalance(accounts[0]);

    accountBalance = web3.utils.fromWei(accountBalance, "Ether");
    if (isMounted) setBalance(accountBalance + " Ξ");
  }, [isMounted]);

  const formChangeHandler = (e, type) => {
    switch (type) {
      case "email":
        setUser((prev) => {
          return { ...prev, email: e.target.value };
        });
        break;
      case "address":
        setUser((prev) => {
          return { ...prev, address: e };
        });
        break;
      case "password":
        setpasswordIsTouched(true);
        setUser((prev) => {
          return { ...prev, password: e.target.value };
        });
        break;

      default:
        break;
    }
  };

  const getUserInfo = useCallback(async () => {
    if (authCtx.email) {
      axios
        .get(`/api/users/user/${authCtx.email}`)
        .then((res) => {
          console.log(res);
          if (isMounted) {
            setUser({
              email: res.data.email,
              address: res.data.address,
              auth: res.data.auth,
              createdAt: new Date(res.data.createdAt).toLocaleString(),
              password: "",
            });
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  }, [authCtx.email, isMounted]);

  useEffect(() => {
    getUserInfo();
    getWalletInfo();
    return () => {
      // clean up
      setIsMounted(false);
    };
  }, [getUserInfo, getWalletInfo]);

  const submintHandler = (e) => {
    e.preventDefault();
    console.log(User);
  };

  return (
    <form onSubmit={submintHandler}>
      <Grid container sx={{ textAlign: "center" }} justifyContent="center">
        {User.email && (
          <Grid item xs={12} sm={9} md={6} lg={5} xl={4}>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <TextField
                required
                id="email"
                label="E-Mail"
                variant="standard"
                type="email"
                value={User.email}
                error={User?.email?.length < 10 ? true : false}
                onChange={(e) => {
                  formChangeHandler(e, "email");
                }}
                autoComplete="username"
              />
            </FormControl>

            <FormControl
              fullWidth
              sx={{ m: 1, flexDirection: "row" }}
              variant="standard"
            >
              <TextField
                required
                id="address"
                label="Address"
                variant="standard"
                error={User?.address?.length < 15 ? true : false}
                value={User.address}
                sx={{ m: 0, width: "80%" }}
                title={User.address}
                InputProps={{
                  readOnly: true,
                }}
                // onChange={(e) => {
                //   formChangeHandler(e, "address");
                // }}
              />
              <LoadingButton
                variant="outlined"
                color="secondary"
                sx={{ m: "5px", width: "20%" }}
                size="small"
                onClick={getCurrentWalletAccount}
                loading={loading}
              >
                Load
              </LoadingButton>
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <TextField
                id="balance"
                label="Balance"
                defaultValue={Balance}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <TextField
                required
                id="password"
                label="Password"
                type="password"
                variant="standard"
                placeholder="비밀번호를 입력하세요."
                error={
                  User?.password?.length < 6 && passwordIsTouched ? true : false
                }
                value={User.password}
                onChange={(e) => {
                  formChangeHandler(e, "password");
                }}
                autoComplete="current-password"
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <TextField
                id="emailauth"
                label="이메일 인증 여부"
                defaultValue={User.auth}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
              />
            </FormControl>

            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <TextField
                id="created"
                label="생성일"
                defaultValue={User.createdAt}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              style={{ marginTop: "20px" }}
              color="secondary"
            >
              저장
            </Button>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default UserForm;
