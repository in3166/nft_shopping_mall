import React, { useContext, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
} from "@mui/material";
import useInput from "../../../hooks/useInputreduce";
import { useDispatch } from "react-redux";
import { userAction } from "../../../store/reducers/user-slice";

const validator = (data) => {
  if (data.length > 6) return true;
  return false;
};

const UserForm = (props) => {
  const { user } = props.user;
  const [open, setopen] = useState(false);

  const {
    value: password,
    valueIsValid: passwordIsValid,
    hasError: passwordHasError,
    inputRef: passwordRef,
    valueChangeHandler: passwordChangeHandler,
    valueBlurHandler: passwordBlurHandler,
    // reset: resetPassword,
  } = useInput(validator);

  const [leave, setLeave] = useState(user.leave);

  const dispatch = useDispatch();

  const submintHandler = (e) => {
    e.preventDefault();
    console.log(password);
    setopen(true);
    if (!passwordIsValid) {
      alert("비밀번호를 6자 이상 입력하세요.");
      setopen(false);
      return;
    }

    const body = {
      password,
      leave,
    };

    axios
      .put("/api/users/profile/" + user.email, body)
      .then((res) => {
        if (res.data.success) {
          dispatch(
            userAction.replaceUserInfo({
              user: { ...user, leave: res.data.leave },
            })
          );
          setLeave(res.data.leave);
          alert(res.data.message);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      })
      .finally(() => {
        setopen(false);
      });
  };

  const dialog = (
    <Dialog
      open={open}
      onClose={() => {
        setopen(false);
      }}
      //PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        회원 탈퇴
      </DialogTitle>
      <DialogContent>
        <DialogContentText>정말로 탈퇴하시겠습니까?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setopen(false);
          }}
        >
          취소
        </Button>
        <Button
          autoFocus
          color="primary"
          variant="contained"
          type="submit"
          onClick={submintHandler}
        >
          신청
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <form>
      {dialog}
      <Grid container sx={{ textAlign: "center" }} justifyContent="center">
        <Grid item xs={12} sm={9} md={6} lg={5} xl={4}>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <TextField
              required
              id="standard-required"
              label="Password"
              type="password"
              variant="standard"
              placeholder="비밀번호를 입력하세요."
              error={passwordHasError}
              value={password}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              ref={passwordRef}
              autoComplete="current-password"
            />
          </FormControl>

          <Button
            variant={!leave ? "contained" : "outlined"}
            type="button"
            style={{ marginTop: "20px" }}
            color="secondary"
            onClick={() => {
              setopen(true);
            }}
          >
            {!leave ? "탈퇴 신청" : "신청 취소"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserForm;
