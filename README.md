# 추가사항

- `<meta name="viewport" content="initial-scale=1, width=device-width" />`

- react version 17.0.2로 업그레이드

  - `npm install react@17.0.2 react-dom@17.0.2`

- material ui 5.3 추가
  - `npm install @mui/material @emotion/react @emotion/styled`
  - table ui 추가
    - `npm install @mui/x-data-grid`
  - `@mui/lab` 추가
  - `@mui/icons-material`

```
xxx버전 업그레이드함 xxx
- material ui 4.7ver 추가 (notistack)
  - `npm install @material-ui/core `
  - `npm install @material-ui/icons`
  - `npm install @material-ui/lab`
  - `npm install @mui/icons-material` (x)
- table ui 추가
  - `@material-ui/x-grid@v4.0.0-alpha.20`
```

- http-proxy-middleware 설치, 추가 setup proxy.js / ipconfig
- db 추가
- axios 설치
  @material-ui/core@4.12.3 @material-ui/icons@4.11.2 @material-ui/lab@4.0.0-alpha.60 @material-ui/x-grid@4.0.0-alpha.20

- 메일 인증 라이브러리: `npm install nodemailer`
  - 서버에 config 추가, controllers에 함수 추가
- postgreSQL: ` npm install sequelize pg pg-hstore`

- ipfs 설치

  - `npm install -g ipfs`
  - `jsipfs init`
  - `jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"POST\", \"GET\"]'`
  - `jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"*\"]'`
  - `jsipfs daemon`

- 다국어 기능 추가

  - `i18next` 라이브러리 사용
  - `npm install react-i18next i18next --save`
  - `npm install i18next-http-backend i18next-browser-languagedetector --save`
  - (i18next 참고)[https://react.i18next.com/latest/using-with-hooks]

- 경매 시간 카운트 추가
  - `react-countdown` 라이브러리 설치

- Banner Carousel 기능 추가
  - `npm install react-material-ui-carousel`
## 기능 추가

- 회원 가입
- 로그인
- JWT 인증 구현 (refresh 미구현)
- 이메일 인증

  - `server/ verify 메서드`
  - `/verify?email=...&code=...`
  - 현재 쿠키로 이메일 인증을 한 후에 success/fail 페이지에 들어왔는지 확인
  - 현재 success/fail => confirm 페이지 하나에서 비동기 요청해서 처리 하는게 나을듯..
    - => `/confirm?code=...`

- 2FA(Goole OTP) 구현

  - 키 생성, RESERT
  - `users` 테이블에 컬럼 추가
  - 라이브러리: `speakeasy`, `qrcode`

- 이미지 업로드 (`multer`)

  - `formData` 와 `{ header: { "content-type": "multipart/form-data" }` 를 사용하여 request를 보내야 한다.
  - `file` 타입의 `input`은 그냥 body에 넣어서 보내면 빈 객체만 보여짐.
  - `file`과 같이 데이터를 보내기 위해 `formData.append('body', JSON.stringfy(body))`를 사용함

- postgreSQL sequelize 외래키 설정하고 조회하기

  ```js
  // 설정 in index
  db.marketplace.belongsTo(db.users, {
    foreignKey: "buyerEmail",
    as: "buyer",
    targetKey: "email",
  });

  // 조회 in controller
  Marketplace.findAll({
    include: [
      {
        model: db.users,
        attributes: ["email", "address"],
        as: "owner",
      },

  // findOne 은 where 절과 함께 객체에 넣기
  Marketplace.findOne({
    where: { id },
    include: [
            { association: "owner" },
      {
        //...
  ```

- 조회수 기능

  - views 테이블: 날짜별, 제품별 통계 분석을 위해 테이블을 따로 둠.

  ```
  (id, ip, client_url, server_url, userEmail, marketplaceId, imageId, date)
  ```

  - `views.controller.js`

    - front에서 `ip-url` 형식으로 localStorage에 저장하여 조회수 연속 추가 방지

    ```js
    // src/utils/ViewCounts.js
    const existed = localStorage.getItem(ip + url);
    if (!!existed) return;

    localStorage.setItem(ip + url, true);

    const request = async () => {
      //...
    };
    ```

    - interval을 줘서 views 테이블에 한 번에 생성할 수 있도록 함. (2-3시간 간격)

    ```js
    const counts = []; // [{id:1,...}, {id:2, ...}, ...]

    const addCount = () => {
      Views.bulkCreate(...) // 여기서 모아진 counts를 db에 넣기
      counts.length = 0;
      console.log(counts);
    };

    const setIntervalQuery = {
      inteval: () =>
        setInterval(() => {
          addCount();
        }, 36000),
    };

    setIntervalQuery.inteval();

    exports.create = async (req, res) => {
      //...
      counts.push(req.body);
      //...
    }
    ```

- 로그 찍기

  -

- 시간 지난 상품 `onMaket` column - false 설정 (`marketplaces.cotroller`)
  - `/bid` 경로에서 모든 제품을 불러올 때 시간 확인, `onMarket` 업데이트
  - 대체 옵션1: db trigger
  - 대체 옵션2: db 프로시저
  - 대체 옵션3: 해당 상품 상세페이지 들어갈 때 시간비교 => 안들어갈 때 문제

## 수정 사항

- 같은 이미지의 경우 mint 방지
  - `ImageContract.sol`
    - `require(!_imageExists[_hash], "ERC721: token already minted");` 추가

## Warning

- `Can't perform a React state update on an unmounted component.`

  - unmount 된 컴포넌트에서 state 업데이트가 발생할 경우
  - `useEffect`에서 `isMounted` 변수(or state)를 clean-up 해준다.
  - 클래스 컴포넌트의 경우 `componenetWillUnmount` 에서 수정!

- `Unhandled Rejection (TypeError): Cannot read properties of null (reading 'methods')`

  - if(this.state.token_sale_contract){} 추가 in MyTokens.jsx, AllCry..., UserNFTDetail.js
    // - mytoken.jsx, allcrt..에 local 메서드 생성자에 추가 (에러 때문)

- `Manifest: Line: 1, column: 1, Syntax error.`

  - `index.html` manifest link 삭제

- express `res.sendfile()` 404

  - `app.use("/uploads", express.static(path.join(__dirname, "/uploads")));`: 최상위 upload 폴더에서 파일 보내기
  - `res.sendFile(path.resolve(path))`;
  - path는 앞에 '/'를 붙이지 않는다. ('uplaods/filename)

- `jsipfs daemon`: `Error: listen EACCES: permission denied 0.0.0.0:4002`
  - windows 해결법 CMD
  - `net stop winnat`
  - `net start winnat`

# 참고

- `err.response.data.message` 서버에서 받은 에러메세지
- 컨트랙스 수정 후 재실행

  - `truffle compile`
  - `truffle migrate --reset`

- sequelize migration - undo
- winsoton, morgan - logger
- `useInputReduce`에서 initalValue 내려줄 때 동일한 객체(전역?)를 내려주면 값을 공유하게 됨 => 객체를 새롭게

<br><br><br>

### ignore

- \*/node_modules
- \*/config
- .env.development
- .env.production

<br><br>

## error

- git push 시 하위 폴더 에러 (`modified content, untracked content`)

  - `.git` 폴더 삭제
  - `git rm -rf --cached`

- Class component history 사용: 해당 컴포넌트를 `withRouter`로 감싸서 export

  <br>

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
