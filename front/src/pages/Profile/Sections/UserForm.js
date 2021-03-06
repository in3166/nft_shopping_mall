import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { updateUserInfo } from "../../../store/actions/user-action";

const UserForm = (props) => {
  const [passwordIsTouched, setpasswordIsTouched] = useState(false);
  const [loading, setloading] = useState(false);
  const [Balance, setBalance] = useState(0);

  const [isMounted, setIsMounted] = useState(true);

  const dispatch = useDispatch();
  // 현재 지갑 address load
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

  useEffect(() => {
    getWalletInfo();

    return () => {
      setIsMounted(false);
    };
  }, [getWalletInfo]);

  const { user: users } = props.user;
  const [User, setUser] = useState({
    email: users?.email,
    address: users?.userAddress,
    email_verification: users?.email_verification ? "Y" : "N",
    createdAt: users?.createdAt && new Date(users?.createdAt).toLocaleString(),
    password: "",
  });

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

  const submintHandler = (e) => {
    e.preventDefault();
    console.log(User);
    const body = User;
    axios
      .put("/api/users/address", body)
      .then((res) => {
        if (res.data.success) {
          alert("저장 완료");
          dispatch(updateUserInfo({ userAddress: body.address }));
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Grid container sx={{ textAlign: "center" }} justifyContent="center">
      {User.email && (
        <Grid item xs={12} sm={9} md={6} lg={5} xl={4}>
          <form onSubmit={submintHandler}>
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
                InputProps={{
                  readOnly: true,
                }}
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
                value={Balance}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
              />
            </FormControl>

            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <TextField
                id="emailauth"
                label="이메일 인증 여부"
                defaultValue={User.email_verification}
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
          </form>
        </Grid>
      )}
    </Grid>
  );
};

export default UserForm;
