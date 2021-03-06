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
  return (dispatch) => {
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
        return { success: false, email: response.data?.email, message: response.data.message };
      }
    } catch (error) {
      return { error: true, message: error };
    }
  };
};

// otp 로그인
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

// 로컬스토리지에 있는 jwt를 확인 후 만료시간이 종료 시 삭제후 로그아웃
// 토큰 존재 시 반환
export const authCheckAction = (token) => {
  return async (dispatch) => {
    const storedExipirationDate = localStorage.getItem("expirationTime");
    console.log("storedExipirationDate1: ", storedExipirationDate);
    const remainingTime = calculateRemainingTime(storedExipirationDate);

    if (remainingTime <= 3600) {
      console.log("storedExipirationDate2: ", storedExipirationDate);
      localStorage.removeItem("nft_token");
      localStorage.removeItem("expirationTime");
      await dispatch(userAction.logout());
      return { isLoggedIn: false };
    }

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

// 페이지 초기 진입 시 jwt 확인 후 로그인
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

// 유저 정보 변경
export const updateUserInfo = (user) => {
  return async (dispatch) => {
    dispatch(userAction.replaceUserInfo({user}));
  };
};
