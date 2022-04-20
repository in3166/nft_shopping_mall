# 추가사항
- `<meta name="viewport" content="initial-scale=1, width=device-width" />`

- material ui 4.7ver 추가 (notistack)
  - `npm install @material-ui/core `
  - `npm install @material-ui/icons`
  - `npm install @material-ui/lab`
  - `npm install @mui/icons-material` (x)

- table ui 추가
  - `@material-ui/x-grid@v4.0.0-alpha.20`
- http-proxy-middleware 설치, 추가 setup proxy.js / ipconfig
- db 추가
- axios 설치

-  if(this.state.token_sale_contract){} 추가 in MyTokens.jsx, AllCry...
  // - mytoken.jsx, allcrt..에 local 메서드 생성자에 추가 (에러 때문)

- 메일 인증 라이브러리: `npm install nodemailer`
  - 서버에 config 추가, controllers에 함수 추가
  
- postgre: ` npm install sequelize pg pg-hstore`

- jwt `npm install jsonwebtoken`
# Jintech NFT Marketplace
<i>NFT marketplace DApp where users mint ERC721 implemented Jintech NFTs.</i>
#
`<img align="right" width="350" src="./image.png"></img>`
### Features
- Mint custom ERC721 implemented Jintech Tokens.
- Sell Jintech tokens on the marketplace.
- Set desired token price.
- Toggle between keeping the token for sale and not for sale.
- Keeps track of all the tokens owned by an account - minted and bought.
- Query blockchain for token owner and token metadata.
- User can mint a token only after every 5 minutes.
#
### Stack
- [Solidity](https://docs.soliditylang.org/en/v0.7.6/) - Object-oriented, high-level language for implementing smart contracts.
- [Bootstrap 4](https://getbootstrap.com/) - CSS framework for faster and easier web development.
- [React.js](https://reactjs.org/) - JavaScript library for building user interfaces.
- [web3.js](https://web3js.readthedocs.io/en/v1.3.4/) - Allows users to interact with a local or remote ethereum node using HTTP, IPC or WebSocket.
- [Truffle](https://www.trufflesuite.com/truffle) - Development environment, testing framework and asset pipeline for blockchains using the Ethereum Virtual Machine (EVM).
- [Ganache](https://www.trufflesuite.com/ganache) - Personal blockchain for Ethereum development used to deploy contracts, develop DApps, and run tests.
#
### Interact with the deployed DApp
- Jintech Marketplace DApp requires [Metamask](https://metamask.io/) browser wallet extension to interact with.
- Connect metamask browser wallet to Kovan Test Network.
- Request and get test etheres for the metamask account from [Kovan Faucet](https://gitter.im/kovan-testnet/faucet) to make transactions.
- Jintech Marketplace Smart Contract is deployed to Kovan Testnet - [0x420d2a6E87D87992EB01e5BFe762B3F437dBfD85](https://kovan.etherscan.io/address/0x420d2a6e87d87992eb01e5bfe762b3f437dbfd85)
- Access Jintech Marketplace DApp at [cryptoboys-NFT-marketplace](https://devpavan04.github.io/cryptoboys-nft-marketplace/) and start minting your Jintech.
#
### Run the DApp Locally
#### Install truffle
```
npm install -g truffle
```
#### Install ganache-cli
```
npm i ganache-cli
```
#### Run ganache-cli
```
ganache-cli --port 7545
```
#### Open new terminal window and clone this repository
```
git clone https://github.com/devpavan04/cryptoboys-NFT-marketplace.git
```
#### Install dependencies
```
cd cryptoboys-NFT-marketplace
npm install
```
#### Compile smart contract
```
truffle compile
```
#### Deploy smart contract to ganache
```
truffle migrate
```
#### Test smart contract
```
truffle test
```
#### Start DApp
```
npm start
```
- Open metamask browser wallet and connect network to Localhost 7545.
- Import accounts from ganache-cli into the metamask browser wallet to make transactions on the DApp.

