import React, { Component } from "react";
import ImageContract from "../../abis/ImageContract.json";
import TokenSaleContract from "../../abis/TokenSaleContract.json";
import Loading from "../Loading/Loading";

import { Link } from "react-router-dom";

class AllCryptoBoys extends Component {
  /**
   *  @update 2021-11-15 hash 부분 추가
   * @param {@} props
   */
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      contract: null,
      totalSupply: 0,
      images: [],
      owners: [],
      imageData_name: [],
      imageData_price: [],
      imageData_token: [], // hash 값 가져오기 추가
      imageData_url: [],
      /* opensea를 위한 state 변수들 */
      name: [],
      description: [],
      image: [],
      attributes: [],
      token_sale_contract: null,
      token_price: 0,
      isLoaded: false,
      ownerKey: [],
    };
  }

  async componentWillMount() {
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    // eslint-disable-next-line
    const accounts = await web3.eth.getAccounts();
    console.log("web3: ", web3);
    console.log("accounts: ", accounts);
    //super 계정의 정보를 집어 넣어야 한다.
    //this.setState({ account: account[0] })
    //this.setState({ account: process.env.REACT_APP_ACCOUNT })

    const networkId = await web3.eth.net.getId();
    const networkData = ImageContract.networks[networkId];
    console.log("networkId: ", networkId);
    console.log("networkData: ", networkData);

    if (networkData) {
      const abi = ImageContract.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({
        contract,
      });
      const totalSupply = await contract.methods.totalSupply().call();

      let ownerKey = new Array(0);
      let metas = new Array(0);
      let ids = new Array(0);
      let owners = new Array(0);
      let inames = new Array(0);
      let iprices = new Array(0);
      let itokens = new Array(0);
      let iurls = new Array(0);

      // Load Owner
      for (let i = 0; i < totalSupply; i++) {
        const owner = await contract.methods.ownerOf(i).call();
        console.log("owner: ", owner);
        if (owner === process.env.REACT_APP_TEMP_ACCOUNT) {
          ownerKey = ownerKey.concat(i);
          owners = owners.concat(owner);
        }
      }
      console.log("ownerKey: ", ownerKey);
      // Load NFTs
      for (var i = 0; i < ownerKey.length; i++) {
        const id = await contract.methods.images(ownerKey[i]).call();
        ids = ids.concat(id);
      }
      // Load NFTs Data
      for (i = 0; i < ownerKey.length; i++) {
        const metadata = await contract.methods.imageData(ownerKey[i]).call();
        //const metadata = null;
        inames = inames.concat(metadata.name);
        iprices = iprices.concat(metadata.price);
        itokens = itokens.concat(metadata.token);
        iurls = iurls.concat(metadata.image);
      }

      this.setState({
        totalSupply,
        account: process.env.REACT_APP_ACCOUNT,
        images: ids,
        owners: owners,
        imageData_name: inames,
        imageData_price: iprices,
        imageData_token: itokens,
        imageData_url: iurls,
        isLoaded: true,
        ownerKey: ownerKey,
      });
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }
    /*
    const sale_networkData = TokenSaleContract.networks[networkId]
    if (sale_networkData) {
      const abi = TokenSaleContract.abi
      const address = sale_networkData.address
      const token_sale_contract = new web3.eth.Contract(abi, address)
      this.setState({ token_sale_contract })
      // console.log(token_sale_contract)

      var token_price = await this.state.token_sale_contract.methods.tokenPrice().call();
      this.setState({ token_price: web3.utils.fromWei(token_price, "ether") })

    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
    */
    console.log("state: ", this.state);
  }

  render() {
    if (this.state.isLoaded) {
      return (
        <div>
          <div className="card mt-1">
            <div className="card-body align-items-center d-flex justify-content-center">
              <h5>
                Total No. of Jintech's Minted On The Platform :{" "}
                {/* 20211108 주석 처리 {totalTokensMinted} */}
              </h5>
            </div>
          </div>
          <div className="d-flex flex-wrap mb-2">
            {/* 이미지 들을 가져와서 화면에 출력 */}
            {this.state.images.map((id, key) => {
              return this.state.owners[key] !== undefined ? (
                <div key={key} className="col-3 card bg-light p-0 m-3">
                  <Link
                    to={{
                      pathname: `/nft-detail/${this.state.ownerKey[key]}`,
                      // state: {name: "vikas"}
                    }}
                  >
                    <div className="col-auto max-250">
                      <img
                        alt="token"
                        className="token"
                        src={this.state.imageData_url[key]}
                        width="100%"
                        height="100%"
                      />
                    </div>
                    <div className="m-6">
                      {"Name - " + this.state.imageData_name[key]}
                    </div>
                    <div className="m-6">
                      {"Token ID - " + this.state.imageData_token[key]}
                    </div>
                    <div className="m-6">
                      {"Price - " + this.state.imageData_price[key]}
                      {/*<img alt="main" className="eth-class" src="../ebizcoin.png" />*/}
                      <img
                        alt="main"
                        className="eth-class"
                        src={require("./ethereum.png").default}
                        width="20"
                        height="20"
                      />
                    </div>
                    <div className="m-6">
                      {"Price - " +
                        this.state.imageData_price[key] *
                          this.state.token_price}
                      {/*<img alt="main" className="eth-class" src="./eth-logo.png" />*/}
                      <img
                        alt="main"
                        className="eth-class"
                        src={require("./ethereum.png").default}
                        width="20"
                        height="20"
                      />
                    </div>
                  </Link>
                </div>
              ) : null;
            })}
          </div>
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}

export default AllCryptoBoys;
