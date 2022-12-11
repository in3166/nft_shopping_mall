import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import "./App.css";
import Web3 from "web3";
import * as actions from "../store/actions/user-action";

import ConnectToMetamask from "../components/ConnectMetamask/ConnectToMetamask";
import Navbar from "../components/Navbar/Navbar";

import Login from "./Login/Login";
import Register from "./Register/Register";
import AuthenticationSuccess from "./Register/Authentication/AuthenticationSuccess";
import AuthenticationFail from "./Register/Authentication/AuthenticationFail";

import Auth from "../hoc/Auth";
import UserList from "./UserList/UserList";
import Profile from "./Profile/Profile";
import UserUpload from "./UserUpload/UserUpload";
import HomePage from "./home/HomePage";
import SettingPage from "./setting/SettingPage";
import UploadList from "./UploadList/UploadList";
import Marketplace from "./Marketplace/Marketplace";
import ProductDetail from "./ProductDetail/ProductDetail";
import MyImage from "./MyImage/MyImage";
import MyImageDetail from "./MyImage/MyImageDetail/MyImageDetail";
import Analysis from "./Analysis/Analysis";

class App extends Component {
  //static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      account: "", // 메뉴에서 관리자가 아닌 사람에게는 mint nft 메뉴가 안보이게 하기 위해 접속한 eth 의 계정 정보를 저장하는 변수
      accountAddress: "",
      accountBalance: "",
      cryptoBoysContract: null,
      cryptoBoysCount: 0,
      cryptoBoys: [],
      loading: true,
      metamaskConnected: undefined,
      contractDetected: false,
      totalTokensMinted: 0,
      totalTokensOwnedByAccount: 0,
      nameIsUsed: false,
      colorIsUsed: false,
      colorsUsed: [],
      lastMintTime: null,
      token: null, //사용자용 token
      isMounted: false,
    };
  }

  componentDidMount = async () => {
    const { getLocalToken } = this.props;
    await getLocalToken();
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.setMintBtnTimer();
    this.setState({ isMounted: true });
  };

  setMintBtnTimer = () => {
    const mintBtn = document.getElementById("mintBtn");
    if (mintBtn !== undefined && mintBtn !== null) {
      this.setState({
        lastMintTime: localStorage.getItem(this.state.accountAddress),
      });
      this.state.lastMintTime === undefined || this.state.lastMintTime === null
        ? (mintBtn.innerHTML = "Mint My Jintech")
        : this.checkIfCanMint(parseInt(this.state.lastMintTime));
    }
  };

  //토큰을 설정 하는 함수를 만드는 법을 확인 해야 함
  setToken = (token) => {
    this.setState({
      token: token,
    });
  };

  checkIfCanMint = (lastMintTime) => {
    console.log("checkIfCanMint");
    const mintBtn = document.getElementById("mintBtn");
    const timeGap = 300000; //5min in milliseconds
    const countDownTime = lastMintTime + timeGap;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countDownTime - now;
      if (diff < 0) {
        mintBtn.removeAttribute("disabled");
        mintBtn.innerHTML = "Mint My Jintech";
        localStorage.removeItem(this.state.accountAddress);
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        mintBtn.setAttribute("disabled", true);
        mintBtn.innerHTML = `Next mint in ${minutes}m ${seconds}s`;
      }
    }, 1000);
  };

  loadWeb3 = async () => {
    console.log("loadWeb3");

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  loadBlockchainData = async () => {
    console.log("loadBlockchainData");
    const web3 = window.web3;
    try {
      const accounts = await web3.eth.getAccounts();
      let body = {};
      body.account = accounts[0];
      if (accounts.length === 0) {
        body.metamaskConnected = false;
      } else {
        body.metamaskConnected = true;
        body.loading = true;
        body.accountAddress = accounts[0];

        let accountBalance = await web3.eth.getBalance(accounts[0]);
        accountBalance = web3.utils.fromWei(accountBalance, "Ether");

        body.accountBalance = accountBalance;
        body.loading = false;
        // const networkId = await web3.eth.net.getId();
        this.setState({ ...body });
        console.log("loadblock 2");
      }
    } catch (error) {
      alert(error);
    }
  };

  //metamask 와 연결 확인
  connectToMetamask = async () => {
    await window.ethereum.enable();
    this.setState({ metamaskConnected: true });
    window.location.href = "/";
  };

  setMetaData = async () => {
    if (this.state.cryptoBoys.length !== 0) {
      this.state.cryptoBoys.map(async (cryptoboy) => {
        const result = await fetch(cryptoboy.tokenURI);
        const metaData = await result.json();
        this.setState({
          cryptoBoys: this.state.cryptoBoys.map((cryptoboy) =>
            cryptoboy.tokenId.toNumber() === Number(metaData.tokenId)
              ? {
                  ...cryptoboy,
                  metaData,
                }
              : cryptoboy
          ),
        });
      });
    }
  };

  render() {
    return (
      <div className="container-d" style={{ paddingBottom: "1px" }}>
        {this.state.isMounted && !this.state.metamaskConnected ? (
          <ConnectToMetamask connectToMetamask={this.connectToMetamask} />
        ) : (
          this.state.isMounted && (
            <>
              <BrowserRouter>
                <Navbar
                  permission={
                    this.state.account === process.env.REACT_APP_TEMP_ACCOUNT
                      ? true
                      : false
                  }
                  history={this.props.history}
                />
                <Route
                  path="/"
                  exact
                  render={() => (
                    <HomePage />
                  )}
                />
                <Route
                  path="/userlist"
                  component={Auth(UserList, true, true)}
                />
                <Route
                  path="/setting"
                  component={Auth(SettingPage, true, true)}
                />
                <Route
                  path="/analysis"
                  component={Auth(Analysis, true, true)}
                />
                <Route path="/login" component={Auth(Login, false)} />
                <Route path="/profile" component={Auth(Profile, true)} />
                <Route path="/upload" component={Auth(UserUpload, true)} />

                <Route path="/bid" component={Auth(Marketplace, true)} />
                <Route path="/myimages" exact component={Auth(MyImage, true)} />
                <Route
                  path="/myimages/:id"
                  component={Auth(MyImageDetail, true)}
                />
                <Route path="/goods/:id" component={Auth(ProductDetail, true)} />

                <Route
                  path="/uploadList"
                  component={Auth(UploadList, true, true)}
                />

                <Route path="/register">
                  <Register></Register>
                </Route>

                <Route path="/success">
                  <AuthenticationSuccess></AuthenticationSuccess>
                </Route>
                <Route path="/fail">
                  <AuthenticationFail></AuthenticationFail>
                </Route>
              </BrowserRouter>
            </>
          )
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  getLocalToken: () => dispatch(actions.getLocalTokenAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
