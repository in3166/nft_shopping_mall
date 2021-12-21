import React, { Component } from "react";
import ImageContract from "../../abis/ImageContract.json";
import ImageSaleContract from "../../abis/ImageSaleContract.json";
import TokenContract from "../../abis/TokenContract.json";
import TokenSaleContract from "../../abis/TokenSaleContract.json";

// CSS
import styles from "./NftDetail.module.css";
// import classes from "./NftDetail.module.css";
import coinImg from "../../public/icons8-coin-32.png";

class NftDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      contract: null,
      sale_contract: null,
      token_contract: null,
      token_sale_contract: null,
      totalSupply: 0,
      token_price: 0,
      images: [],
      owners: [],
      imageData_name: [],
      imageData_price: [],
      imageData_des: [],
      imageData_url: [],
      imageData_token: [],
      selling_to: "",
      selling_price: null,
      approved: [],
      new_price: null,
      transactions: [],
    };
  }

  async componentWillMount() {
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = ImageContract.networks[networkId];
    if (networkData) {
      const abi = ImageContract.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      //console.log(contract)
      // console.log(await contract.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest' }))

      this.setState({ contract });
      const totalSupply = await contract.methods.totalSupply().call();
      // console.log(totalSupply)
      this.setState({ totalSupply });

      // Load NFTs
      for (var i = 1; i <= totalSupply; i++) {
        const id = await contract.methods.images(i - 1).call();
        // console.log(id)
        this.setState({
          images: [...this.state.images, id],
        });
      }

      // Load Owner
      for (i = 1; i <= totalSupply; i++) {
        const owner = await contract.methods.ownerOf(i - 1).call();
        // console.log(owner)
        this.setState({
          owners: [...this.state.owners, owner],
        });
      }

      // Load NFTs Data
      for (i = 1; i <= totalSupply; i++) {
        const metadata = await contract.methods.imageData(i - 1).call();
        // console.log(metadata)
        this.setState({
          imageData_name: [...this.state.imageData_name, metadata.name],
          imageData_price: [...this.state.imageData_price, metadata.price],
          imageData_des: [...this.state.imageData_des, metadata.description],
          imageData_url: [...this.state.imageData_url, metadata.url],
          imageData_token: [...this.state.imageData_token, metadata.token],
        });
      }
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }

    const sale_networkData = ImageSaleContract.networks[networkId];
    if (sale_networkData) {
      const sale_abi = ImageSaleContract.abi;
      const sale_address = sale_networkData.address;
      const sale_contract = new web3.eth.Contract(sale_abi, sale_address);
      this.setState({ sale_contract });

      // console.log(sale_contract)
      const transactions = await sale_contract.getPastEvents("BoughtNFT", {
        fromBlock: 0,
        toBlock: "latest",
      });
      // console.log(transactions)

      for (i = 0; i < transactions.length; i++) {
        this.setState({
          transactions: [
            ...this.state.transactions,
            transactions[i].returnValues,
          ],
        });
      }

      for (i = 1; i <= this.state.totalSupply; i++) {
        var approv = await this.state.contract.methods
          .isApprovedOrOwner(this.state.sale_contract._address, i - 1)
          .call();
        this.setState({ approved: [...this.state.approved, approv] });

        // console.log(approv);
      }
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }

    const token_networkData = TokenContract.networks[networkId];
    if (this.state.token_sale_contract) {
      if (token_networkData) {
        const abi = TokenContract.abi;
        const address = token_networkData.address;
        const token_contract = new web3.eth.Contract(abi, address);
        this.setState({ token_contract });
        // console.log(await token_contract.methods.totalSupply().call())
      } else {
        window.alert("Smart contract not deployed to detected network.");
      }

      const token_sale_networkData = TokenSaleContract.networks[networkId];
      if (token_sale_networkData) {
        const abi = TokenSaleContract.abi;
        const address = token_sale_networkData.address;
        const token_sale_contract = new web3.eth.Contract(abi, address);
        this.setState({ token_sale_contract });
        // console.log(token_sale_contract)

        var token_price = await this.state.token_sale_contract.methods
          .tokenPrice()
          .call();
        this.setState({
          token_price: web3.utils.fromWei(token_price, "ether"),
        });
      } else {
        window.alert("Smart contract not deployed to detected network.");
      }
      console.log("this state image token = ", this.state.imageData_token[0]);
    }
  }

  buyEth = (key) => {
    const web3 = window.web3;
    web3.eth
      .sendTransaction({
        to: this.state.owners[key],
        from: this.state.account,
        value:
          web3.utils.toWei(this.state.imageData_price[key], "ether") *
          this.state.token_price,
      })
      .once("receipt", (receipt) => {
        console.log("ether transfered");

        this.state.sale_contract.methods
          .buyImage(
            this.state.owners[key],
            key,
            this.state.imageData_price[key]
          )
          .send({ from: this.state.account })
          .once("receipt", (receipt) => {
            console.log("nft bought");
          });
      });
  };

  buyEtk = (key) => {
    const web3 = window.web3;
    this.state.token_contract.methods
      .transfer(
        this.state.owners[key],
        web3.utils.toWei(this.state.imageData_price[key], "ether")
      )
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        console.log("tokens transfered");

        this.state.sale_contract.methods
          .buyImage(
            this.state.owners[key],
            key,
            this.state.imageData_price[key]
          )
          .send({ from: this.state.account })
          .once("receipt", (receipt) => {
            console.log("nft bought");
          });
      });
  };

  approveNFT = (key) => {
    /**
     * setState 가 완료 되기전에 전송 되는 문제를 해결하기 위해 주석 아래와 같은 코드로 수정
     * update 2021-11-15
     */
    /*
        if(this.state.new_price == null){
            this.setState({new_price: this.state.imageData_price[key]})
        }
        */
    if (this.state.new_price == null) {
      console.log("price = ", this.state.imageData_price[key]);
      this.state.contract.methods
        .updatePrice(key, this.state.imageData_price[key])
        .send({ from: this.state.account })
        .once("receipt", (receipt) => {
          console.log("price updated");
          this.state.contract.methods
            .approveNFT(this.state.sale_contract._address, key)
            .send({ from: this.state.account })
            .once("receipt", (receipt) => {
              console.log("nft approved for sale");
            });
        });
    } else {
      console.log("price = ", this.state.new_price);
      this.state.contract.methods
        .updatePrice(key, this.state.new_price)
        .send({ from: this.state.account })
        .once("receipt", (receipt) => {
          console.log("price updated");
          this.state.contract.methods
            .approveNFT(this.state.sale_contract._address, key)
            .send({ from: this.state.account })
            .once("receipt", (receipt) => {
              console.log("nft approved for sale");
            });
        });
    }
  };

  render() {
    const nft_id_path = window.location.pathname.split("/");
    const key = nft_id_path[nft_id_path.length - 1];

    console.log("key: ", key);
    console.log("owner: ", this.state.owners[key]);
    console.log("url : ", this.state.imageData_url[key]);
    return (
      <div className={`contents ${styles.contents}`}>
        <div className="card page-head">
          <div className="card-body align-items-center d-flex justify-content-center">
            <h5>NFT Detail</h5>
          </div>
        </div>
        <div className="detail-info container-fluid nft-detail-adj">
          <div className="detail-info-wrapper d-flex justify-content-around">
            {/* d-flex  */}
            <div className="flex-wrap detail-adj-box">
              <div className="adj-img-wrap">
                {/* max-300 */}
                <img
                  alt="main"
                  className="homeimage shadow-lg rounded"
                  src={this.state.imageData_url[key]}
                  width="100%"
                />
              </div>
            </div>
            <div className="detail-table-wrap">
              <div className="table-adj">
                <div className="table-responsive">
                  <div className="adj-title-name flex-wrap">
                    {this.state.imageData_name[key]}
                  </div>
                  <table className="detail-table-custom">
                    {" "}
                    {/* table table-sm table-borderless  */}
                    <colgroup>
                      <col style={{ minWidth: "120px" }} />
                      <col />
                    </colgroup>
                    <tbody>
                      <tr>
                        {/*}<th className="w-40" scope="row"><strong>Name</strong></th>
                                                <td >{this.state.imageData_name[key]}</td> */}
                      </tr>
                      <tr>
                        <th className="w-40" scope="row">
                          Owner
                        </th>
                        {/* <td>{this.state.owners[key]}</td> */}
                        <td>{this.state.owners[key]}</td>
                      </tr>
                      <tr>
                        <th className="w-40" scope="row">
                          Token ID
                        </th>
                        <td>{this.state.imageData_token[key]}</td>
                      </tr>
                      <tr>
                        <th className="w-40" scope="row">
                          Url
                        </th>
                        <td>{this.state.imageData_url[key]}</td>
                      </tr>
                      <tr>
                        <th className="w-40" scope="row">
                          Description
                        </th>
                        <td>{this.state.imageData_des[key]}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex-wrap mt-4 price-etk">
                {this.state.owners[key] != null &&
                this.state.owners[key] ===
                  process.env.REACT_APP_TEMP_ACCOUNT ? (
                  !this.state.approved[key] &&
                  process.env.REACT_APP_TEMP_ACCOUNT === this.state.account ? (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        this.approveNFT(key);
                      }}
                    >
                      <div className="price-etk-wrap d-flex">
                        <div className="etk-title">Price in ETK</div>{" "}
                        {/**pric */}
                        <input
                          type="text"
                          className="form-control"
                          placeholder="New Price in ETK"
                          defaultValue={this.state.imageData_price[key]}
                          onChange={(event) =>
                            this.setState({ new_price: event.target.value })
                          }
                        />
                        <input
                          type="submit"
                          className="btn btn-primary"
                          value={"Approve for Sale"}
                        />
                      </div>
                    </form>
                  ) : null
                ) : null}
              </div>

              <div className="d-flex justify-content-center align-items-center">
                {/*
                                <div className="mx-2">
                                    {
                                        (this.state.approved[key] && (process.env.REACT_APP_ACCOUNT !== this.state.account)) ?
                                            (
                                                <form onSubmit={(event) => {
                                                    event.preventDefault()
                                                    this.buyEtk(key);
                                                }}>
                                                    <button type="submit" className='btn btn-block btn-primary rounded-0 text-dark'>
                                                        {"Buy - " + this.state.imageData_price[key]}
                                                        <img alt="main" className="eth-class" src="../ebizcoin.png" />
                                                    </button>
                                                </form>
                                            )
                                            : null
                                    }
                                </div>
                                */}

                <div className="mx-2 submit-btn-box">
                  {this.state.approved[key] &&
                  process.env.REACT_APP_TEMP_ACCOUNT !== this.state.account ? (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        this.buyEth(key);
                      }}
                    >
                      {/* <input
                                                type='submit'
                                                className='btn btn-block btn-primary rounded-0'
                                                value={"Buy - " + (this.state.imageData_price[key] * this.state.token_price) + " ETH"}
                                            /> */}
                      <button
                        type="submit"
                        className="btn submit-btn btn-primary text-dark"
                      >
                        {"Buy - " +
                          this.state.imageData_price[key] *
                            this.state.token_price}
                        <img
                          alt="main"
                          className="eth-class"
                          src="../eth-logo.png"
                        />
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>

              {/* <div className="d-flex justify-content-center align-items-center my-1">
                                {
                                    (!this.state.approved[key] && (process.env.REACT_APP_ACCOUNT !== this.state.account)) ?
                                        (
                                            <div className="text-danger">{"This NFT is not Approved by Owner"}</div>
                                        )
                                        : null
                                }
                            </div> */}

              {/* 이동 */}
              <div className="detail-action mt-4">
                <h5>Transactions</h5>
                <div className="tb-tab-wrap d-flex">
                  <span className="tb-tab active-tb">Bid History</span>
                  <span className="tb-tab">Price in ETK</span>{" "}
                  {/* 필요시 활성화 */}
                </div>
                <table className="table table-sm table-borderless bid-history-tb">
                  <colgroup>
                    <col style={{ width: "75%" }} />
                    <col />
                  </colgroup>
                  <tbody>
                    {/***** 임시 *****/}

                    <tr>
                      <td>
                        <img
                          src={coinImg}
                          className="bid-icon"
                          alt="name-img"
                        />
                        <span className="bid-name">Lorem</span>
                        <span className="pl-bid">placed a bid</span>
                        <span className="history-time">1 day ago</span>
                      </td>
                      <td>
                        <span className="eth-price">
                          <img alt="main" className="eth-class" src={coinImg} />
                          230.00
                        </span>
                        <span className="eth-dolor">&#36; 245.00</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          src={coinImg}
                          className="bid-icon"
                          alt="name-img"
                        />
                        <span className="bid-name">Inpum</span>
                        <span className="pl-bid">placed a bid</span>
                        <span className="history-time">1 day ago</span>
                      </td>
                      <td>
                        <span className="eth-price">
                          <img alt="main" className="eth-class" src={coinImg} />
                          110.00
                        </span>
                        <span className="eth-dolor">&#36; 100.00</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          src={coinImg}
                          className="bid-icon"
                          alt="name-img"
                        />
                        <span className="bid-name">Dolor</span>
                        <span className="pl-bid">placed a bid</span>
                        <span className="history-time">1 day ago</span>
                      </td>
                      <td>
                        <span className="eth-price">
                          <img alt="main" className="eth-class" src={coinImg} />
                          123.00
                        </span>
                        <span className="eth-dolor">&#36; 122.00</span>
                      </td>
                    </tr>

                    {/***** 임시 *****/}
                    {/* {this.state.transactions.slice(0).reverse().map((transaction, i) => {
                                            return (
                                                (transaction._tokenId === key) ?
                                                    (
                                                        <tr key={i}>
                                                            <td>{transaction._buyer}</td>
                                                            <td>{transaction._price}</td>
                                                        </tr>
                                                    ) : null
                                            )
                                        }) 
                                        } */}
                  </tbody>
                </table>

                <table className="table table-sm table-borderless hide-tb">
                  {" "}
                  {/* 필요시 활성화 */}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default NftDetail;
