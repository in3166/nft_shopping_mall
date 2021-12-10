import React, { Component, useState } from "react";
/* 신 버전 추가 */
import ImageContract from "../../abis/ImageContract.json";
import ImageSaleContract from "../../abis/ImageSaleContract.json";
import Crypto from "crypto";

/* 2021-11-19 ipfs 를 위한 취가 */
import { create } from "ipfs-http-client";
import styles from "./FormAndPreview.module.css";
/* 2021-11-22 서버에서 ipfs-http-client가 안돌아가서 교체 */

class FormAndPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: "",
      contract: null,
      sale_contract: null,
      totalSupply: 0,
      images: [],
      owners: [],
      imageData_name: [],
      imageData_price: [],
      selling_to: "",
      selling_price: null,
      new_image: new Blob(),
      new_name: "",
      new_des: "",
      new_price: "",
      new_url: "", //2021-11-20 이후 이 url은 파일의 위치 정보로 사용 된다.
      new_token: "",
      buffer: null, //ipfsapi 때문에 생성
    };
    //this.ipfs_client = create('http://jte.iptime.org:5001/api/v0');
    //this.ipfs_client = IpfsApi('52.78.70.151', '5001', {protocol:'http'})
    /*
    this.ipfs_client = create({
      host: '52.78.70.151',
      port: 5001,
      protocol: 'http'
    })
    */
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
      // console.log(contract)
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
      console.log(sale_contract);
      this.setState({ sale_contract });
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }
  }

  /**
   * 2021-11-15 파일 구분 정보를 위해 해시를 추가
   * 2021-11-19 파일 서버를 ipfs 로 전환 하면서 새로 작성 하려고 기존 mintImage는 주석처리
   */
  async mintImage() {
    let file = "";
    //var client = create("http://jtsol.iptime.org:5001/api/v0");
    var client = create("https://ipfs.infura.io:5001/api/v0");
    //var client = create("http://127.0.0.1:5001/");
    console.log('client: ',client)
    const { cid } = await client.add(this.state.new_image);
    console.log('cid: ',cid)
    const urlStr = `http://jtsol.iptime.org:8080/ipfs/${cid}`;
    // const urlStr = `http://localhost:8082/ipfs/${cid}`;
    this.setState({
      new_url: urlStr,
    });
    console.log("url = ", this.state.new_url);
    this.getBase64(this.state.new_image, (result) => {
      file = result;
      //파일의 고유 정보와 구분을 위해 해시를 추가 함 기존은 url 로 구분 되어 블록체인에 등록되지 않는 경우 발생
      const hash = Crypto.createHash("sha256").update(file).digest("base64");
      this.setState({
        new_token: hash,
      });

      // this.state.new_hash 를 파일 구분을 위해 추가 함
      this.state.contract.methods
        .mint(
          this.state.new_name,
          this.state.new_des,
          this.state.new_url,
          this.state.new_price,
          this.state.new_token
        )
        .send({ from: this.state.account })
        .once("receipt", (receipt) => {

          console.log("nft receipt: ", receipt);
          console.log("nft created");
        });
    });
  }

  /*
  async mintImage(){
    const file = this.state.new_image;
      console.log('mintImage file= ', file.size);
    try{
     var client = create('http://jte.iptime.org:5001/api/v0');
     const { cid } = await client.add(file);
     const urlStr = `http://jte.iptime.org:8080/ipfs/${cid}`;
       this.setState({
         new_url:urlStr, 
         new_token: cid,
       })

      //mint
      await this.state.contract.methods.mint(
        this.state.new_name,
        this.state.new_des,
        this.state.new_url,
        this.state.new_price,
        this.state.new_token
      ).send({from: this.state.account})
      .once('receipt', (receipt) => {
        alert("NFT Created");
      })
    }catch(error){
      alert('Error uploading file : ', error );
    }
  }
  */

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  render() {
    return (
      <div>
        <div className="card mt-1">
          <div className="card-body align-items-center d-flex justify-content-center">
            <h5>Select your file</h5>
          </div>
        </div>
        <div className="container-fluid pt-5 create-mint-adj">
          <div className="row">
            <div className="col-12 form-wrapper px-3">
              <div className="form-container">
                <h3 className="mb-4">Create Image NFT</h3>
                <form
                  className="row text-end"
                  onSubmit={(event) => {
                    event.preventDefault();
                    this.mintImage();
                  }}
                >
                  <div className="col-6">
                    <span className={styles["form-input-name"]}>Name</span>
                    <input
                      type="file"
                      required
                      className="form-control my-2"
                      placeholder="Choose Image"
                      onChange={(event) =>
                        this.setState({ new_image: event.target.files[0] })
                      }
                    />
                  </div>
                  <div className="col-6">
                  <span className={styles["form-input-name"]}>Url</span>
                    <input
                      type="text"
                      required
                      className="form-control my-2"
                      placeholder="Name"
                      onChange={(event) =>
                        this.setState({ new_name: event.target.value })
                      }
                    />
                  </div>
                  {/*  2021-11-20  주석처리 (자동 입력)
                  <div className="col-6">
                    <input
                      type='text' required
                      className='form-control my-2'
                      placeholder='Url'
                      onChange={event => this.setState({ new_url: event.target.value })}
                    />
                  </div>
                  */}
                  <div className="col-6">
                  <span className={styles["form-input-name"]}>Price</span>
                    <input
                      type="text"
                      required
                      className="form-control my-2"
                      placeholder="Price in Ebizon Tokens"
                      onChange={(event) =>
                        this.setState({ new_price: event.target.value })
                      }
                    />
                  </div>
                  <div className="col-12">
                  <span className={styles["form-input-name"]}>Description</span>
                    <textarea
                      type="text"
                      required
                      className="form-control my-2"
                      placeholder="Description"
                      rows="3"
                      onChange={(event) =>
                        this.setState({ new_des: event.target.value })
                      }
                    />
                  </div>
                  <div className="submit-btn-box col-12 mt-2">
                    <input
                      type="submit"
                      className="btn btn-block btn-primary my-3 rounded-0"
                      value="Create Image NFT"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FormAndPreview;
