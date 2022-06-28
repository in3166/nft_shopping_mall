import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../store/actions/user-action";
import "./App.css";
import Web3 from "web3";

import ConnectToMetamask from "./ConnectMetamask/ConnectToMetamask";
import Navbar from "./Navbar/Navbar";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AuthenticationSuccess from "./pages/Register/Authentication/AuthenticationSuccess";
import AuthenticationFail from "./pages/Register/Authentication/AuthenticationFail";

import Auth from "../hoc/Auth";
import UserList from "./pages/UserList/UserList";
import Profile from "./pages/Profile/Profile";
import UserUpload from "./pages/UserUpload/UserUpload";
import HomePage from "./pages/home/HomePage";
import SettingPage from "./pages/setting/SettingPage";
import UploadList from "./pages/UploadList/UploadList";
import Marketplace from "./pages/Marketplace/Marketplace";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import MyImage from "./pages/MyImage/MyImage";
import MyImageDetail from "./pages/MyImage/MyImageDetail/MyImageDetail";
import Analysis from "./pages/Analysis/Analysis";
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
    const { token, getLocalToken, user } = this.props;
    await getLocalToken();
    await this.loadWeb3();
    await this.loadBlockchainData();
    // await this.setMetaData();
    await this.setMintBtnTimer();
    // console.log("token: ", token, user);
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
      // this.setState({ account: accounts[0] }); //접속한 사용자에 따라 mint nft 메뉴를 안보이게 할때 쓰는 변수 (update 2021-11-15)
      body.account = accounts[0];
      if (accounts.length === 0) {
        //this.setState({ metamaskConnected: false });
        body.metamaskConnected = false;
      } else {
        // this.setState({ metamaskConnected: true });
        // this.setState({ loading: true });
        // this.setState({ accountAddress: accounts[0] });
        body.metamaskConnected = true;
        body.loading = true;
        body.accountAddress = accounts[0];

        let accountBalance = await web3.eth.getBalance(accounts[0]);
        accountBalance = web3.utils.fromWei(accountBalance, "Ether");

        // this.setState({ accountBalance });
        // this.setState({ loading: false });
        body.accountBalance = accountBalance;
        body.loading = false;
        const networkId = await web3.eth.net.getId();

        //   const networkData = CryptoBoys.networks[networkId];

        //   if (networkData) {
        //     this.setState({ loading: true });
        //     //body.loading = true;

        //     const cryptoBoysContract = new web3.eth.Contract(
        //       CryptoBoys.abi,
        //       networkData.address
        //     );

        //     // this.setState({ cryptoBoysContract });
        //     // this.setState({ contractDetected: true });
        //     body.cryptoBoysContract = cryptoBoysContract;
        //     body.contractDetected = true;

        //     const cryptoBoysCount = await cryptoBoysContract.methods
        //       .cryptoBoyCounter()
        //       .call();

        //     //this.setState({ cryptoBoysCount });
        //     body.cryptoBoysCount = cryptoBoysCount;

        //     for (var i = 1; i <= cryptoBoysCount; i++) {
        //       const cryptoBoy = await cryptoBoysContract.methods
        //         .allCryptoBoys(i)
        //         .call();

        //       // this.setState({
        //       //   cryptoBoys: [...this.state.cryptoBoys, cryptoBoy],
        //       // });

        //       body.cryptoBoys = [...this.state.cryptoBoys, cryptoBoy];
        //     }

        //     let totalTokensMinted = await cryptoBoysContract.methods
        //       .getNumberOfTokensMinted()
        //       .call();
        //     totalTokensMinted = totalTokensMinted.toNumber();

        //     this.setState({ totalTokensMinted });
        //     body.totalTokensMinted = totalTokensMinted;

        //     let totalTokensOwnedByAccount = await cryptoBoysContract.methods
        //       .getTotalNumberOfTokensOwnedByAnAddress(this.state.accountAddress)
        //       .call();
        //     totalTokensOwnedByAccount = totalTokensOwnedByAccount.toNumber();

        //     this.setState({ totalTokensOwnedByAccount });
        //     this.setState({ loading: false });
        //     body.totalTokensOwnedByAccount = totalTokensOwnedByAccount;
        //     body.loading = false;
        //   } else {
        //     this.setState({ contractDetected: false });
        //     body.contractDetected = false;
        //   }
        // }
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

  //민트 메인 메소드
  /*
  mintMyNFT = async (colors, name, tokenPrice) => {
    this.setState({ loading: true });
    const colorsArray = Object.values(colors);
    let colorsUsed = [];
    for (let i = 0; i < colorsArray.length; i++) {
      if (colorsArray[i] !== "") {
        let colorIsUsed = await this.state.cryptoBoysContract.methods
          .colorExists(colorsArray[i])
          .call();
        if (colorIsUsed) {
          colorsUsed = [...colorsUsed, colorsArray[i]];
        } else {
          continue;
        }
      }
    }
    const nameIsUsed = await this.state.cryptoBoysContract.methods
      .tokenNameExists(name)
      .call();
    if (colorsUsed.length === 0 && !nameIsUsed) {
      const {
        cardBorderColor,
        cardBackgroundColor,
        headBorderColor,
        headBackgroundColor,
        leftEyeBorderColor,
        rightEyeBorderColor,
        leftEyeBackgroundColor,
        rightEyeBackgroundColor,
        leftPupilBackgroundColor,
        rightPupilBackgroundColor,
        mouthColor,
        neckBackgroundColor,
        neckBorderColor,
        bodyBackgroundColor,
        bodyBorderColor,
      } = colors;
      let previousTokenId;
      previousTokenId = await this.state.cryptoBoysContract.methods
        .cryptoBoyCounter()
        .call();
      previousTokenId = previousTokenId.toNumber();
      const tokenId = previousTokenId + 1;
      const tokenObject = {
        tokenName: "Jintech",
        tokenSymbol: "CB",
        tokenId: `${tokenId}`,
        name: name,
        metaData: {
          type: "color",
          colors: {
            cardBorderColor,
            cardBackgroundColor,
            headBorderColor,
            headBackgroundColor,
            leftEyeBorderColor,
            rightEyeBorderColor,
            leftEyeBackgroundColor,
            rightEyeBackgroundColor,
            leftPupilBackgroundColor,
            rightPupilBackgroundColor,
            mouthColor,
            neckBackgroundColor,
            neckBorderColor,
            bodyBackgroundColor,
            bodyBorderColor,
          },
        },
      };
      const cid = await ipfs.add(JSON.stringify(tokenObject));
      let tokenURI = `https://ipfs.infura.io/ipfs/${cid.path}`;
      const price = window.web3.utils.toWei(tokenPrice.toString(), "Ether");
      this.state.cryptoBoysContract.methods
        .mintCryptoBoy(name, tokenURI, price, colorsArray)
        .send({ from: this.state.accountAddress })
        .on("confirmation", () => {
          localStorage.setItem(this.state.accountAddress, new Date().getTime());
          this.setState({ loading: false });
          window.location.reload();
        });
    } else {
      if (nameIsUsed) {
        this.setState({ nameIsUsed: true });
        this.setState({ loading: false });
      } else if (colorsUsed.length !== 0) {
        this.setState({ colorIsUsed: true });
        this.setState({ colorsUsed });
        this.setState({ loading: false });
      }
    }
  };

  toggleForSale = (tokenId) => {
    this.setState({ loading: true });
    this.state.cryptoBoysContract.methods
      .toggleForSale(tokenId)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  changeTokenPrice = (tokenId, newPrice) => {
    this.setState({ loading: true });
    const newTokenPrice = window.web3.utils.toWei(newPrice, "Ether");
    this.state.cryptoBoysContract.methods
      .changeTokenPrice(tokenId, newTokenPrice)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  buyCryptoBoy = (tokenId, price) => {
    this.setState({ loading: true });
    this.state.cryptoBoysContract.methods
      .buyToken(tokenId)
      .send({ from: this.state.accountAddress, value: price })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };
  */
  render() {
    /* 로그인 버튼으로 로그인 했을때만 mint nft 메뉴가 보이도록 전환 하기 위해  일단 주석처리 update 2015-11-15
    if(!this.state.token){
      //위의 setToken 함수를 매개변수로 던져 줌 
      return <Login setToken={this.setToken}/>
    }
    */
    // console.log(
    //   "process.env.REACT_APP_ACCOUNT: ",
    //   process.env.REACT_APP_ACCOUNT
    // );
    console.log("app run");
    // console.log(this.state);
    console.log("this.state.metamaskConnected: ", this.state.metamaskConnected);
    return (
      <div className="container-d" style={{ paddingBottom: "1px" }}>
        {/* metamask 와 연결 되었는가? */}
        {this.state.isMounted && !this.state.metamaskConnected ? (
          /* 아니면 연결 창으로 이동 */
          <ConnectToMetamask connectToMetamask={this.connectToMetamask} />
        ) : (
          this.state.isMounted && (
            /*
        ) : !this.state.contractDetected ? (
          <Loading />
        ) : this.state.loading ? (
          <Loading />
          */
            <>
              <BrowserRouter>
                {/* 관리자 계정이 아닐때는 즉 false 일때는 my mint 메뉴가 안보이게 하기 위해 2021-11.15 에 추가 했다 */}
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
                    // <AccountDetails
                    //   accountAddress={this.state.accountAddress}
                    //   accountBalance={this.state.accountBalance}
                    // />
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