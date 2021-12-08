/**
 * 2021-11-19년 일반 사용자의 이미지 리스트를 출력하기 위해 생성
 */

import React, { Component } from "react";
import ImageContract from "../../abis/ImageContract.json";
import TokenSaleContract from "../../abis/TokenSaleContract.json";

import { Link } from "react-router-dom";

class MyTokens extends Component {
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
      token_sale_contract: null,
      token_price: 0,
    };
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    try {
      // Load account
      const accounts = await web3.eth.getAccounts();
      //일반 사용자의 계정 정보를 집어 넣어야 한다.
      this.setState({ account: accounts[0] });

      const networkId = await web3.eth.net.getId();
      const networkData = ImageContract.networks[networkId];
      console.log("accout[0]: ", accounts[0]);
      console.log("networkId: ", networkId);
      console.log("networkData: ", networkData);
      if (networkData) {
        const abi = ImageContract.abi;
        const address = networkData.address;
        const contract = new web3.eth.Contract(abi, address);
        console.log("abi: ", abi);
        console.log("address: ", address);
        console.log("contract: ", contract);
        // console.log(contract)
        this.setState({ contract });
        // totalSupply() : 발행된 총 토큰의 개수를 리턴함.
        // balanceOf() : _owner가 가진 계좌 잔고를 리턴함.
        // transfer() : _to 주소로 _value 만큼의 이더를 전송함.
        // transferFrom() : _from 주소에서 _to 주소로 _value 만큼의 이더를 전송함.
        // approve() : _spender가 인출할 수 있는 한도를 지정함. (신용카드 한도같은 느낌)
        // allowance() : _owner가 _spender에게 인출을 허락한 토큰의 개수
        console.log("totalSupply: ");
        const totalSupply = await contract?.methods?.totalSupply()?.call();
        console.log("totalSupply: ", totalSupply);
        this.setState({ totalSupply });

        // Load NFTs
        for (var i = 1; i <= totalSupply; i++) {
          const id = await contract.methods.images(i - 1).call();
          console.log("id: ", id);
          this.setState({
            images: [...this.state.images, id],
          });
        }
        // Load Owner
        for (i = 1; i <= totalSupply; i++) {
          const owner = await contract.methods.ownerOf(i - 1).call();
          // console.log(owner)
          console.log("owner: ", owner);
          this.setState({
            owners: [...this.state.owners, owner],
          });
        }
        // Load NFTs Data
        for (i = 1; i <= totalSupply; i++) {
          const metadata = await contract.methods.imageData(i - 1).call();
          console.log("metadata: ", metadata);
          // console.log(metadata)
          this.setState({
            imageData_name: [...this.state.imageData_name, metadata.name],
            imageData_price: [...this.state.imageData_price, metadata.price],
            imageData_token: [...this.state.imageData_token, metadata.token],
            imageData_url: [...this.state.imageData_url, metadata.url],
          });
        }
      } else {
        window.alert("Smart contract not deployed to detected network.");
      }

      const sale_networkData = TokenSaleContract.networks[networkId];
      console.log("metadata: ", sale_networkData);
      if (sale_networkData) {
        const abi = TokenSaleContract.abi;
        const address = sale_networkData.address;
        const token_sale_contract = new web3.eth.Contract(abi, address);
        this.setState({ token_sale_contract });
        // console.log(token_sale_contract)

        if (this.state.token_sale_contract) {
          var token_price = await this.state.token_sale_contract.methods
            .tokenPrice()
            .call();
          console.log("token_price: ", token_price);
          this.setState({
            token_price: web3.utils.fromWei(token_price, "ether"),
          });
        }
      } else {
        window.alert("Smart contract not deployed to detected network.");
      }
    } catch (err) {
      console.log(`toekn err:, ${err}`);
      alert(`toekn err: ${err}`);
    }
  }

  async componentDidMount() {
    await this?.loadBlockchainData();
  }
  /*
  const AllCryptoBoys = ({
    cryptoBoys,
    accountAddress,
    totalTokensMinted,
    changeTokenPrice,
    toggleForSale,
    buyCryptoBoy,
  }) => {
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (cryptoBoys.length !== 0) {
        if (cryptoBoys[0].metaData !== undefined) {
          setLoading(loading);
        } else {
          setLoading(false);
        }
      }
    }, [cryptoBoys]);
    */
  render() {
    //console.log(this.state.images);
    return (
      <div>
        <div className="card mt-1">
          <div className="card-body align-items-center d-flex justify-content-center">
            <h5>
              My Token list
              {/* 20211108 주석 처리 {totalTokensMinted} */}
            </h5>
          </div>
        </div>
        <div className="d-flex flex-wrap mb-2">
          {/* 이미지 들을 가져와서 화면에 출력 */}
          {this.state.images.map((id, key) => {
            return this.state.owners[key] === this.state.account ? (
              <div key={key} className="col-3 card bg-light p-0 m-3">
                <Link
                  to={{
                    // ipfs 주소로 수정 (2021-11-20)
                    // pathname: `${this.state.imageData_url[key]}`,
                    // state: {name: "vikas"}
                    pathname: `/user-nft-detail/${key}`,
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
                      this.state.imageData_price[key] * this.state.token_price}
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
  }
}

export default MyTokens;
