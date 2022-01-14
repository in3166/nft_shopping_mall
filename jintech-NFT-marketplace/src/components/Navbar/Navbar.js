import React, { useState } from "react";
import icon from "./favicon-32x32.png";
import { Link } from "react-router-dom";

import AnalyticsIcon from "@mui/icons-material/Analytics";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions/user-action";
import { useTranslation } from "react-i18next";
import styles from "./Navbar.module.css";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import i18next from "i18next";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const options = [t("Navbar.lang.en"), t("Navbar.lang.ko")];

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

  // profile
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //lang
  const getLanguage = () => i18next.language || window.localStorage.i18nextLng;
  const lang = getLanguage();
  console.log("lang? ", lang);
  const [LanguageAnchor, setLanguageAnchor] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(
    lang.includes("ko") ? 1 : 0
  );

  const openLanguage = Boolean(LanguageAnchor);

  const handleClickLanguage = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedLanguage(index);
    i18n.changeLanguage(index === 0 ? "en" : "ko");
    setLanguageAnchor(null);
  };

  const handleCloseLanguage = () => {
    setLanguageAnchor(null);
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

        <div
          id="navbarNav"
          className="collapse navbar-collapse"
          style={{ justifyContent: "space-between" }}
        >
          <ul className={`navbar-nav ${styles.ul} ${styles["ul_left"]}`}>
            <li className={`nav-item ${styles["nav-li"]}`}>
              <Link to="/marketplace" className="nav-link">
                {t("Navbar.marketplace")}
              </Link>
            </li>
            {user.isLoggedIn && (
              <>
                <li className={`nav-item ${styles["nav-li"]}`}>
                  <Link to="/mytokens" className="nav-link">
                    {t("Navbar.mytokens")}
                  </Link>
                </li>
                <li className={`nav-item ${styles["nav-li"]}`}>
                  <Link to="/bid" className="nav-link">
                    경매
                  </Link>
                </li>
                <li className={`nav-item ${styles["nav-li"]}`}>
                  <Link to="/myimages" className="nav-link">
                    My Images
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ul className={`navbar-nav ${styles.ul} ${styles["ul_right"]}`}>
            {
              //r관리자 계정 이면 보이고 아니면 안보이는 메뉴 (update : 2021-11-15)
              //this.props.permission && this.getToken() ? (
              user.isAdmin ? (
                <li className={`nav-item ${styles["nav-li"]}`}>
                  <Link to="/mint" className="nav-link">
                    {t("Navbar.mintnft")}
                  </Link>
                </li>
              ) : null
            }
            {user.isLoggedIn && !user.isAdmin && (
              <li className={`nav-item ${styles["nav-li"]}`}>
                <Link to="/upload" className="nav-link">
                  {t("Navbar.upload")}
                </Link>
              </li>
            )}
            {user.isAdmin && (
              <>
                <li className={`nav-item ${styles["nav-li"]}`}>
                  <Link className="nav-link" to="/uploadList">
                    {t("Navbar.uploadlist")}
                  </Link>
                </li>
                <li className={`nav-item ${styles["nav-li"]}`}>
                  <Link className="nav-link" to="/userlist">
                    {t("Navbar.userlist")}
                  </Link>
                </li>
              </>
            )}

            {!user.isLoggedIn && (
              <li className={`nav-item ${styles["nav-li"]}`}>
                <Link to="/login" className="nav-link">
                  {t("Navbar.login")}
                </Link>
              </li>
            )}

            {user.isLoggedIn && (
              // profile
              <li className={`nav-item ${styles["nav-li"]}`}>
                <Box
                  className="nav-link"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        opacity: 0.6,
                        ":hover": { opacity: 1.0 },
                      }}
                    />
                  </IconButton>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                      "@media (max-width: 767px)": {
                        "&:before": {
                          left: 11,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Link to="/profile">
                    <MenuItem>
                      <ListItemIcon>
                        <AccountBoxIcon fontSize="small" />
                      </ListItemIcon>
                      {t("Navbar.profile")}
                    </MenuItem>
                  </Link>
                  <Divider />
                  {user.isAdmin && (
                    <div>
                      <Link to="/setting">
                        <MenuItem>
                          <ListItemIcon>
                            <Settings fontSize="small" />
                          </ListItemIcon>
                          {t("Navbar.settings")}
                        </MenuItem>
                      </Link>
                      <Link to="/analysis">
                        <MenuItem>
                          <ListItemIcon>
                            <AnalyticsIcon fontSize="small" />
                          </ListItemIcon>
                          Analysis
                        </MenuItem>
                      </Link>
                    </div>
                  )}

                  <MenuItem onClick={logoutHandler}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    {t("Navbar.logout")}
                  </MenuItem>
                </Menu>
              </li>
            )}

            {/* language */}
            <li className={`nav-item ${styles["nav-li"]}`}>
              <List aria-label="Device settings" className="nav-link">
                <ListItem
                  id="lock-button"
                  className={styles.lang}
                  aria-haspopup="listbox"
                  aria-controls="lock-menu"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClickLanguage}
                >
                  {options[selectedLanguage]}
                </ListItem>
              </List>
              <Menu
                id="lock-menu"
                anchorEl={LanguageAnchor}
                open={openLanguage}
                onClose={handleCloseLanguage}
                className={styles["lang-menu"]}
                MenuListProps={{
                  "aria-labelledby": "lock-button",
                  role: "listbox",
                }}
              >
                {options.map((option, index) => (
                  <MenuItem
                    key={option}
                    selected={index === selectedLanguage}
                    onClick={(event) => handleMenuItemClick(event, index)}
                    className={
                      index === selectedLanguage && styles["selected-lang"]
                    }
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
