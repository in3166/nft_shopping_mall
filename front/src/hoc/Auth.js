import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { authCheckAction } from "../store/actions/user-action";
import { userAction } from "../store/reducers/user-slice";

// option: 1-loggedin / 0-not loggedin

export default function auth(SpecificComponent, option, adminRoute = null) {
  const AuthCheck = (props) => {
    const [AuthChecked, setAuthChecked] = useState(false);
    const [IsMounted, setIsMounted] = useState(true);
    const user = useSelector((state) => state.user);
    const history = useHistory();
    //console.log("hoc run");
    const dispatch = useDispatch();
    // server auth 검사는 아직 적용 안함.

    useEffect(() => {
      const token = JSON.parse(localStorage.getItem("nft_token"));
      // console.log("hoc token: ", token);
      if (token) {
        dispatch(authCheckAction(token))
          .then((res) => {
            if (!res.isLoggedIn) {
              if (option) {
                history.push("/login");
              }
              // Loggined in Status
            } else if (adminRoute && !res.isAdmin) {
              // supposed to be Admin page, but not admin person wants to go inside
              history.push("/");
            } else if (option === false) {
              // Logged in Status, but Try to go into log in page
              history.push("/");
            }
            if (IsMounted) setAuthChecked(true);
          })
          .catch((err) => {
            console.log(err);
            alert("!: ", err);
            history.push("/login");
            if (IsMounted) setAuthChecked(true);
          });
      } else if (!token && history.location.pathname !== "/login") {
        console.log("login");
        alert("로그인 하세요.");
        history.push("/login");
        if (IsMounted) setAuthChecked(true);
      }
      return () => {
        setIsMounted(false);
      };
    }, [history, dispatch, IsMounted]);

    return (
      <SpecificComponent {...props} user={user} authChecked={AuthChecked} />
    );
  };
  return AuthCheck;
}
