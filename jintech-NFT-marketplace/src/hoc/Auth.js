import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import AuthContext from "../store/auth-context";

// option: 1-loggedin / 0-not loggedin

export default function auth(SpecificComponent, option, adminRoute = null) {
  const AuthCheck = (props) => {
    const authCtx = useContext(AuthContext);
    const history = useHistory();

    // server auth 검사는 아직 적용 안함.
    useEffect(() => {
      const token = JSON.parse(localStorage.getItem("nft_token"));
      console.log("hoc token: ", token);
      if (token?.accessToken) {
        const body = { token: token.accessToken };
        axios
          .post(`/api/users/auth`, body)
          .then((res) => {
            console.log("res: ", res);
            if (!res.data.isLoggedIn) {
              if (option) {
                history.push("/login");
              }
              // Loggined in Status
            } else if (adminRoute && !res.data.isAdmin) {
              // supposed to be Admin page, but not admin person wants to go inside
              history.push("/");
            } else if (option === false) {
              // Logged in Status, but Try to go into log in page
              history.push("/");
            }
          })
          .catch((err) => {
            console.log(err);
            alert(err);
            history.push("/login");
          });
      } else if(!token?.accessToken && history.location.pathname !== '/login'){
        alert("로그인 하세요.");
        history.push("/login");
      }
    }, [history]);

    return <SpecificComponent {...props} />;
  };
  return AuthCheck;
}
