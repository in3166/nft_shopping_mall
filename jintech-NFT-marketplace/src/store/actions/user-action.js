import axios from "axios";
import { userAction } from "../reducers/user-slice";

let logoutTimer;

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

// 로그 아웃
export const logoutAction = () => {
  return async (dispatch) => {
    localStorage.removeItem("nft_token");
    localStorage.removeItem("expirationTime");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    dispatch(userAction.logout());
  };
};

const setLocalStorage = (response) => {
  localStorage.setItem(
    "nft_token",
    JSON.stringify(response.data.token.accessToken)
  );
  //console.log(
  //   "response.data.token.expireTime: ",
  //   response.data.token.expireTime
  // );
  // console.log(
  //   "response.data.token.expireTime2: ",
  //   new Date(
  //     new Date().getTime() + response.data.token.expireTime * 1000 * 30
  //   )
  // );

  const remainingTime = calculateRemainingTime(
    new Date(new Date().getTime() + response.data.token.expireTime * 1000 * 30)
  );

  localStorage.setItem(
    "expirationTime",
    new Date(new Date().getTime() + response.data.token.expireTime * 30)
  );
  logoutTimer = setTimeout(logoutAction, remainingTime);
};
// 로그인
export const loginAction = (body) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("/api/users/login", body);
      //console.log("response: ", response);

      if (response.data.success) {
        if (!response.data.user.otp) {
          setLocalStorage(response);
          dispatch(
            userAction.login({
              user: response.data.user,
              token: response.data.token,
            })
          );
          return { success: true, otp: false };
        } else {
          return { success: true, otp: true, data: response.data };
        }
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { error: true, message: error };
    }
  };
};

// 로그인
export const otpConfirmAction = (data) => {
  return async (dispatch) => {
    console.log("users: ", data.user);
    try {
      const response = await axios.post("/api/auth/verify", {
        code: data.code,
        email: data.user.email,
      });

      if (response.data.success) {
        if (response.data.verify) {
          console.log(data);
          console.log(data.user);
          console.log(data.token);
          const body = {
            data,
          };
          setLocalStorage(body);
          dispatch(userAction.login({ user: data.user, token: data.token }));
          return { success: true };
        } else {
          return { success: false, message: "코드가 틀립니다." };
        }
      }
    } catch (error) {
      return { error: true, message: error };
    }
  };
};

// 가져온 토큰이 유효한 경우에만 초기화하고 유효하지 않으면 삭제
const retrieveStoredToken = () => {
  const storedToken = JSON.parse(localStorage.getItem("nft_token"));
  const storedExipirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExipirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem("nft_token");
    localStorage.removeItem("expirationTime");
    return null;
  } else {
    return { token: storedToken, expireTime: remainingTime };
  }
};

//
export const authCheckAction = (token) => {
  return async (dispatch) => {
    const body = { token };
    //console.log("token: ", token);

    try {
      const response = await axios.post(`/api/users/auth`, body);
      if (response.statusText === "OK") {
        //console.log("res auth: ", response);
        //dispatch(userAction.replaceUserInfo({ user: response.data }));
        return response.data;
      }
    } catch (error) {
      console.log("authCheckAction: ", error);
      alert("auth check error");
    }
  };
};

// 페이지 초기 진입 시 토큰 확인 후 로그인
export const getLocalTokenAction = (user, token) => {
  return async (dispatch) => {
    const tokenData = retrieveStoredToken();
    let initialToken;
    if (tokenData) {
      initialToken = tokenData.token;
      console.log("initialToken: ", initialToken);
      logoutTimer = setTimeout(logoutAction, tokenData.duration);
      dispatch(authCheckAction(initialToken)).then((res) => {
        dispatch(userAction.replaceUserInfo({ user: res }));
      });
      //console.log("user: ", user);
      //console.log("tokenData: ", tokenData);
    } else {
      dispatch(userAction.logout());
    }
  };
};
