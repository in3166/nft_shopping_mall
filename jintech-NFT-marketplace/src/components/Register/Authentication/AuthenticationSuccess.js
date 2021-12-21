import React from "react";
import { Link, useHistory } from "react-router-dom";
import Card from "../../UI/Card/Card";
import classes from "./Authentication.module.css";

const AuthenticationSuccess = () => {
  const history = useHistory();
  let cookieValue = document.cookie.replace(
    /(?:(?:^|.*;\s*)valid\s*\\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  if (!!cookieValue !== true) {
    history.replace("/");
  }
  return (
    <Card className={classes.auth}>
      <div>이메일 인증을 성공하였습니다.</div>
      <Link to="/login" className={classes.link}>
        로그인 하기
      </Link>
    </Card>
  );
};

export default AuthenticationSuccess;
