import React from "react";
import icon from "./favicon-32x32.png";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions/user-action";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const getToken = () => {
    const tokenString = sessionStorage.getItem("nft_user_token");
    const userToken = JSON.parse(tokenString);
    //임시 코드 , 2021-11-15
    let result = false;

    try {
      result = userToken.accessToken !== "" ? true : false;
    } catch (e) {
      result = false;
    }
    return result;
  };

  const logoutHandler = () => {
    dispatch(actions.logoutAction());
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container">
        <img src={icon} alt="" />
        <Link to="/" className="navbar-brand ml-2">
          NFT's
        </Link>
        <button
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="navbarNav" className="collapse navbar-collapse">
          <ul
            style={{ fontSize: "0.8rem", letterSpacing: "0.2rem" }}
            className="navbar-nav ml-auto"
          >
            {/* <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li> */}
            {
              //r관리자 계정 이면 보이고 아니면 안보이는 메뉴 (update : 2021-11-15)
              //this.props.permission && this.getToken() ? (
              user.isAdmin ? (
                <li className="nav-item">
                  <Link to="/mint" className="nav-link">
                    {t("Navbar.mintnft")}
                  </Link>
                </li>
              ) : null
            }
            {user.isLoggedIn && !user.isAdmin && (
              <li className="nav-item">
                <Link to="/upload" className="nav-link">
                {t("Navbar.upload")}
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/marketplace" className="nav-link">
              {t("Navbar.marketplace")}
              </Link>
            </li>
            {user.isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/userlist">
                  {t("Navbar.userlist")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/setting">
                  {t("Navbar.settings")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/uploadList">
                  {t("Navbar.uploadlist")}
                  </Link>
                </li>
              </>
            )}
            {user.isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/mytokens" className="nav-link">
                  {t("Navbar.mytokens")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">
                  {t("Navbar.profile")}
                  </Link>
                </li>
              </>
            )}
            {!user.isLoggedIn && (
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                {t("Navbar.login")}
                </Link>
              </li>
            )}
            {user.isLoggedIn && (
              <li
                className="nav-item"
                style={{ cursor: "pointer" }}
                onClick={logoutHandler}
              >
                <div className="nav-link">{t("Navbar.logout")}</div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
