import React, { Component } from 'react';
import ImageContract from '../../abis/ImageContract.json';
import ImageSaleContract from '../../abis/ImageSaleContract.json';
import TokenContract from '../../abis/TokenContract.json';
import TokenSaleContract from '../../abis/TokenSaleContract.json';
import Loading from '../Loading/Loading';

class UserNFTDetail extends Component {

    constructor(props) {
        super(props)
        /**
         * @update 2022-01-09 특정 이미지  1개  만  불러오도록수정 
         */
        /*
        this.state = {
            account: '',
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
            selling_to: '',
            selling_price: null,
            approved: [],
            new_price: null,
            transactions: [],
        }
        */
        this.state = {
            account: '',
            contract: null,
            sale_contract: null,
            token_contract: null,
            token_sale_contract: null,
            totalSupply: 0,
            token_price: 0,
            image: '',
            owner: '',
            imageData_name: '',
            imageData_price: 0,
            imageData_des: '',
            imageData_url: '',
            imageData_token: '',
            selling_to: '',
            selling_price: null,
            approved: null,
            new_price: null,
            transactions: [],
            isLoaded: false,
        }
    }

    async componentWillMount() {
        await this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const nft_id_path = window.location.pathname.split('/')
        const key = nft_id_path[nft_id_path.length - 1]

        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })

        const networkId = await web3.eth.net.getId()
        const networkData = ImageContract.networks[networkId]
        if (networkData) {
            const abi = ImageContract.abi
            const address = networkData.address
            const contract = new web3.eth.Contract(abi, address)
            //console.log(contract)
            // console.log(await contract.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest' }))

            this.setState({ contract })
            const totalSupply = await contract.methods.totalSupply().call()
            // console.log(totalSupply)
            this.setState({ totalSupply })


            // Load NFTs
                const id = await contract.methods.images(key).call()
                // console.log(id)
            // Load Owner
                const owner = await contract.methods.ownerOf(key).call()
            // Load NFTs Data 
                const metadata = await contract.methods.imageData(key).call()
                // console.log(metadata)
                this.setState({
                    contract,
                    image: id,
                    owner: owner,
                    imageData_name: metadata.name,
                    imageData_price: metadata.price,
                    imageData_des: metadata.description,
                    imageData_url: metadata.image,
                    imageData_token: metadata.token,
                    isLoaded:true,
                })

        } else {
            window.alert('Smart contract not deployed to detected network.')
        }

        const sale_networkData = ImageSaleContract.networks[networkId]
        if (sale_networkData) {
            const sale_abi = ImageSaleContract.abi
            const sale_address = sale_networkData.address
            const sale_contract = new web3.eth.Contract(sale_abi, sale_address)
            this.setState({ sale_contract })

            // console.log(sale_contract)
            const transactions = await sale_contract.getPastEvents('BoughtNFT', { fromBlock: 0, toBlock: 'latest' })
            // console.log(transactions)

            for (let i = 0; i < transactions.length; i++) {
                this.setState({ transactions: [...this.state.transactions, transactions[i].returnValues] })
            }


                var approv = await this.state.contract.methods.isApprovedOrOwner(this.state.sale_contract._address, (key)).call();
                this.setState({ approved: approv })


        } else {
            window.alert('Smart contract not deployed to detected network.')
        }

        const token_networkData = TokenContract.networks[networkId]
        if (token_networkData) {
            const abi = TokenContract.abi
            const address = token_networkData.address
            const token_contract = new web3.eth.Contract(abi, address)
            this.setState({ token_contract })
            // console.log(await token_contract.methods.totalSupply().call())

        } else {
            window.alert('Smart contract not deployed to detected network.')
        }

        const token_sale_networkData = TokenSaleContract.networks[networkId]
        if (token_sale_networkData) {
            const abi = TokenSaleContract.abi
            const address = token_sale_networkData.address
            const token_sale_contract = new web3.eth.Contract(abi, address)
            this.setState({ token_sale_contract })
            // console.log(token_sale_contract)

            var token_price = await this.state.token_sale_contract.methods.tokenPrice().call();
            this.setState({ token_price: web3.utils.fromWei(token_price, "ether") })

        } else {
            window.alert('Smart contract not deployed to detected network.')
        }
        //console.log('this state image token = ', this.state.imageData_token);

    }


    buyEth = (key) => {
        const web3 = window.web3
        web3.eth.sendTransaction({ to: this.state.owner, from: this.state.account, value: web3.utils.toWei(this.state.imageData_price, "ether") * this.state.token_price })
            .once('receipt', (receipt) => {

                this.state.sale_contract.methods.buyImage(this.state.owner, key, this.state.imageData_price).send({ from: this.state.account })
                    .once('receipt', (receipt) => {
                        console.log("nft bought")
                    })
            })


    }

    buyEtk = (key) => {
        const web3 = window.web3
        this.state.token_contract.methods.transfer(
            this.state.owner,
            web3.utils.toWei(this.state.imageData_price, "ether")
        ).send({ from: this.state.account, })
            .once('receipt', (receipt) => {
                //console.log("tokens transfered")

                this.state.sale_contract.methods.buyImage(this.state.owner, key, this.state.imageData_price).send({ from: this.state.account })
                    .once('receipt', (receipt) => {
                        console.log("nft bought")
                    })
            })

    }

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
            console.log("price = ", this.state.imageData_price)
            this.state.contract.methods.updatePrice(
                key, this.state.imageData_price
            ).send({ from: this.state.account })
                .once('receipt', (receipt) => {
                    console.log("price updated");
                    this.state.contract.methods.approveNFT(
                        this.state.sale_contract._address, key
                    ).send({ from: this.state.account })
                        .once('receipt', (receipt) => {
                            console.log("nft approved for sale");
                        });
                });
        } else {
            console.log("price = ", this.state.new_price);
            this.state.contract.methods.updatePrice(
                key, this.state.new_price
            ).send({ from: this.state.account })
                .once('receipt', (receipt) => {
                    console.log("price updated");
                    this.state.contract.methods.approveNFT(
                        this.state.sale_contract._address, key
                    ).send({ from: this.state.account })
                        .once('receipt', (receipt) => {
                            console.log("nft approved for sale");
                        });
                });
        }

    }

    render() {
        const nft_id_path = window.location.pathname.split('/')
        const key = nft_id_path[nft_id_path.length - 1]
        if(this.state.isLoaded){
        return (
            <div>
                <div className="card mt-1">
                    <div className="card-body align-items-center d-flex justify-content-center">
                        <h5>My NFT Detail</h5>
                    </div>
                </div>
                <div className="container-fluid nft-detail-adj">
                    <div className="d-flex justify-content-around">
                        <div className="col-4">
                            <a href={this.state.imageData_url}>
                            <div className="max-300">
                                {/* 2021-11-20 부터 ipfs의 이미지 주소(this.state.imageData_url로 변경 
                                <img alt="main" className="homeimage shadow-lg rounded" src={localStorage.getItem(this.state.imageData_name[key])} width="100%" height="100%" />
                                */}
                                <img alt="main" className="homeimage shadow-lg rounded" src={this.state.imageData_url} width="100%" height="100%" />
                            </div>
                            </a>
                        </div>

                        <div className="col-8">
                            <div className="table-adj">
                                <div className="table-responsive">
                                    <table className="table table-sm table-borderless table-hover">
                                        <tbody className="">
                                            <tr>
                                                <th className="pl-0 w-40" scope="row"><strong>Name</strong></th>
                                                <td>{this.state.imageData_name}</td>
                                            </tr>
                                            <tr>
                                                <th className="pl-0 w-40" scope="row"><strong>Owner</strong></th>
                                                {/* <td>{this.state.owners[key]}</td> */}
                                                <td>{
                                                    this.state.owner
                                                }</td>
                                            </tr>
                                            <tr>
                                                <th className="pl-0 w-40" scope="row"><strong>Token ID</strong></th>
                                                <td>{this.state.imageData_token}</td>
                                            </tr>
                                            <tr>
                                                <th className="pl-0 w-40" scope="row"><strong>Url</strong></th>
                                                <a href={this.state.imageData_url}>
                                                <td>{this.state.imageData_url}</td>
                                                </a>
                                            </tr>
                                            <tr>
                                                <th className="pl-0 w-40" scope="row"><strong>Description</strong></th>
                                                <td>{this.state.imageData_des}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 사용자 상세 페이지에 버튼 필요 없음 */}
                            <div className="d-flex justify-content-center align-items-center my-1">
                                {
                                    /*((this.state.owners[key] != null) && (this.state.owners[key] === process.env.REACT_APP_ACCOUNT) ) ?*/
                                    (this.state.owner != null) ?
                                   ( 
                                    /*(!this.state.approved[key] && (process.env.REACT_APP_ACCOUNT === this.state.account))  ?
                                        (
                                            */
                                    (!this.state.approved) ? 
                                    (
                                            <form onSubmit={(event) => {
                                                event.preventDefault()
                                                this.approveNFT(key);
                                            }}>
                                                <div className="d-flex">
                                                    <div className="w-75 my-1">Price in ETH-</div>
                                                    <input
                                                        type='text'
                                                        className='form-control mx-1'
                                                        placeholder='New Price in ETK'
                                                        defaultValue={this.state.imageData_price}
                                                        onChange={event => this.setState({ new_price: event.target.value })}
                                                    />
                                                    <input
                                                        type='submit'
                                                        className='btn btn-block btn-primary rounded-0 mx-1'
                                                        value={"Approve for Sale"}
                                                    />
                                                </div>
                                            </form>
                                        )
                                        : null
                                    )
                                    :null
                                }
                            </div>

                            <div className="d-flex justify-content-center align-items-center">
                                {/* 사용자 상세페이지에 버튼은 필요 없음 */}
                                <div className="mx-2">
                                    {
                                        (this.state.approved && (process.env.REACT_APP_ACCOUNT !== this.state.account)) ?
                                            (
                                                <form onSubmit={(event) => {
                                                    event.preventDefault()
                                                    this.buyEtk(key);
                                                }}>
                                                    <button type="submit" className='btn btn-block btn-primary rounded-0 text-dark'>
                                                        {"Buy - " + this.state.imageData_price}
                                                        <img alt="main" className="eth-class" src="../ebizcoin.png" />
                                                    </button>
                                                </form>
                                            )
                                            : null
                                    }
                                </div>
                                {/*

                                <div className="mx-2">
                                    {
                                        (this.state.approved[key] && (process.env.REACT_APP_ACCOUNT !== this.state.account)) ?
                                            (
                                                <form onSubmit={(event) => {
                                                    event.preventDefault()
                                                    this.buyEth(key);
                                                }}>
                                                    <button type="submit" className='btn btn-block btn-primary rounded-0 text-dark'>
                                                        {"Buy - " + (this.state.imageData_price[key] * this.state.token_price)}
                                                        <img alt="main" className="eth-class" src="../eth-logo.png" />
                                                    </button>
                                                </form>
                                            )
                                            : null
                                    }
                                </div>
                                */}
                            </div>

                            <div className="d-flex justify-content-center align-items-center my-1">
                                {
                                    (!this.state.approved && (process.env.REACT_APP_ACCOUNT !== this.state.account)) ?
                                        (
                                            <div className="text-danger">{"This NFT is not Approved by Owner"}</div>
                                        )
                                        : null
                                }
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h5>Transactions</h5>
                        <table className="table table-sm table-borderless">
                            <thead>
                                <tr>
                                    <th>Buyer</th>
                                    <th>Price in ETH</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.transactions.slice(0).reverse().map((transaction, i) => {
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
                                }
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        );
        }else{
            return(
                <Loading/>
            );
        }

    }

}
export default UserNFTDetail;
