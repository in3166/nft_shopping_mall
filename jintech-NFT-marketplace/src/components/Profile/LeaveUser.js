import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../../store/auth-context";
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
import useInput from "../../hooks/useInputreduce";
const validator = (data) => {
  if (data.length > 6) return true;
  return false;
};
const UserForm = () => {
  const authCtx = useContext(AuthContext);
  const [open, setopen] = useState(false);
  const {
    value: password,
    valueIsValid: passwordIsValid,
    hasError: passwordHasError,
    inputRef: passwordRef,
    valueChangeHandler: passwordChangeHandler,
    valueBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput(validator);

  const submintHandler = (e) => {
    e.preventDefault();
    console.log(password);
    setopen(true);
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
          onClick={() => {
            setopen(false);
          }}
        >
          신청
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <form onSubmit={submintHandler}>
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
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            style={{ marginTop: "20px" }}
            color="secondary"
          >
            탈퇴 신청
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserForm;
