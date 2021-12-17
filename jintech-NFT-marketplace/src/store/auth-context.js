import React, { useCallback, useEffect, useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  isAdmim: false,
  address: "",
  email: "",
  leave: "",
  otp: "",
});

let logoutTimer;

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

// 가져온 토큰이 유효한 경우에만 초기화하고 유효하지 않으면 삭제
const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("nft_token");
  const storedExipirationDate = localStorage.getItem("expirationTime");
  const remainingTime = calculateRemainingTime(storedExipirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem("nft_token");
    localStorage.removeItem("expirationTime");
    return null;
  } else {
    return { token: storedToken, duration: remainingTime };
  }
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [Token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!Token; // true, false 값을 true, false Boolean 값으로 변환 ex. 빈문자열 -> false
  console.log("Token ", Token);

  // const isAdmin = Token
  //   ? JSON.parse(Token).address === process.env.REACT_APP_TEMP_ACCOUNT
  //   : false;
  const isAdmin = Token ? JSON.parse(Token).roles[0] === "ROLE_ADMIN" : false;
  const address = Token ? JSON.parse(Token).address : "";
  const email = Token ? JSON.parse(Token).email : "";
  const leave = Token ? JSON.parse(Token).leave : "N";
  const otp = Token ? JSON.parse(Token).otp : "N";
  console.log('otp: ', otp)
  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("nft_token");
    localStorage.removeItem("expirationTime");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    window.location.href = "/login";
  }, []);

  const loginHandler = (
    token,
    expirationTime = new Date(new Date().getTime() + 10 * 30 * 10000) //30분
  ) => {
    setToken(JSON.stringify(token));
    localStorage.setItem("nft_token", JSON.stringify(token));
    const remainingTime = calculateRemainingTime(expirationTime);
    localStorage.setItem("expirationTime", expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: Token,
    isLoggedIn: userIsLoggedIn,
    isAdmin,
    address,
    email,
    leave,
    otp,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
