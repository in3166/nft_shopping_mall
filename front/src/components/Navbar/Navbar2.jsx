import React, { Component } from "react";
import icon from "./favicon-32x32.png";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { connect } from "react-redux";
import * as actions from "../../store/actions/user-action";

class Navbar extends Component {
  static contextType = AuthContext;
  /**
   * 예외처리
   * update 2021-11-15
   * @returns 사용자 토큰 유무에 따른 결과 리턴
   */
  getToken() {
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
  }

  render() {
    const { user, logout } = this.props;
    console.log("nav user: ", user);

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
                      Mint NFT
                    </Link>
                  </li>
                ) : null
              }
              {user.isLoggedIn && !user.isAdmin && (
                <li className="nav-item">
                  <Link to="/upload" className="nav-link">
                    Upload
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link to="/marketplace" className="nav-link">
                  Marketplace
                </Link>
              </li>

              {/* 2021-11-25 주석처리 */}
              {/*
              <li className="nav-item">
                <Link to="/queries" className="nav-link">
                  Queries
                </Link>
              </li>
              */}
              {user.isAdmin && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/userlist">
                      Users
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/setting">
                      Settings
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/uploadList">
                      Upload List
                    </Link>
                  </li>
                </>
              )}
              {user.isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link to="/mytokens" className="nav-link">
                      My Tokens
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link">
                      Profile
                    </Link>
                  </li>
                </>
              )}
              {!user.isLoggedIn && (
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
              )}
              {user.isLoggedIn && (
                <li
                  className="nav-item"
                  style={{ cursor: "pointer" }}
                  onClick={logout}
                >
                  <div className="nav-link">Logout</div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(actions.logoutAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
