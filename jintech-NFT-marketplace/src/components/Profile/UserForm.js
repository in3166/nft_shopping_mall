import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import { Box, FormControl, Grid, TextField } from "@mui/material";

const UserForm = () => {
  const authCtx = useContext(AuthContext);
  const [User, setUser] = useState({});

  const [formValue, setformValue] = useState({});

  const formChangeHandler = (e, type) => {
    switch (type) {
      case "email":
        setformValue({ email: e.target.value, ...formValue });
        break;
      case "address":
        setformValue({ address: e.target.value, ...formValue });
        break;
      case "password":
        setformValue({ password: e.target.value, ...formValue });
        break;

      default:
        break;
    }
  };

  const getUserInfo = useCallback(() => {
    axios
      .get(`/api/users/user/${authCtx.email}`)
      .then((res) => {
        console.log(res);
        setUser({
          email: res.data.email,
          address: res.data.address,
          auth: res.data.auth,
          createdAt: res.data.createdAt,
        });
      })
      .catch((err) => {
        alert(err);
      });
  }, [authCtx.email]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <Grid container sx={{ textAlign: "center" }} justifyContent="center">
      {User.email && (
        <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <TextField
              required
              id="standard-required"
              label="E-Mail"
              defaultValue={User.email}
              variant="standard"
              value={formValue.email}
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <TextField
              required
              id="standard-required"
              label="Address"
              defaultValue={User.address}
              variant="standard"
              error={(data) => {
                if (data.length < 10) return true;
              }}
              value={formValue.address}
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <TextField
              required
              id="standard-required"
              label="Password"
              variant="standard"
              placeholder="비밀번호를 입력하세요."
              error={formValue?.password?.length < 6 ? true : false}
              value={formValue.password}
              onChange={(e) => {
                formChangeHandler(e, "password");
              }}
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <TextField
              id="standard-read-only-input"
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
              id="standard-read-only-input"
              label="생성일"
              defaultValue={User.createdAt}
              InputProps={{
                readOnly: true,
              }}
              variant="standard"
            />
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
};

export default UserForm;
