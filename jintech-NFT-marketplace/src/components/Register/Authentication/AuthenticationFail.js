import React from "react";
import { Link, useHistory } from "react-router-dom";
import Card from "../../UI/Card/Card";
import classes from "./Authentication.module.css";

const AuthenticationFail = () => {
  const history = useHistory();
  let cookieValue = document.cookie.replace(
    /(?:(?:^|.*;\s*)valid\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  if (!!cookieValue !== true) {
    history.replace("/");
  }
  return (
    <Card className={classes.auth}>
      <div>이메일 인증에 실패하였습니다.</div>
      <div>회원 가입을 다시 시도하세요.</div>
      <Link to="/register" className={classes.link}>
        회원가입
      </Link>
    </Card>
  );
};

export default AuthenticationFail;
