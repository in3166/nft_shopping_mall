# NFT 쇼핑몰
- 유저가 업로드한 이미지를 운영자가 NFT로 변경하여 쇼핑몰에 상품 등록할 수 있는 서비스
<img src="https://github.com/in3166/nft_shopping_mall/blob/master/images/home.PNG" width="70%" />

- 상품은 경매와 판매로 등록 가능하다.
  - 경매로 등록할 경우 페이지에 경매 버튼이 보인다.
  - 설정한 시간 동안 경매에 참여 가능하고 시간이 지나면 낙찰자가 있는 경우 낙찰자에게 해당 상품이 판매된다.
  - 경매에 참여 History를 보여준다.

<br>

- [페이지 설명](https://github.com/in3166/nft_shopping_mall/blob/master/images/%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%84%A4%EB%AA%85.md)


<br><br>


# 기능
- 회원가입, 로그인
  - 메일 인증: `nodemailer`
    - 서버에 config 추가, controllers에 함수 추가
    - 회원 가입을 완료 한 후 등록한 메일을 인증해야 로그인이 가능하다.

  - `server/verify`
  - `/verify?email=...&code=...`
<br>

- 사용자 계정 관리

  - 지갑 정보 갱신 가능
  - 좋아요 목록
  - 구매, 판매 이력 리스트
  - 2차 인증 사용 관리
  - 회원 탈퇴
<br>

- 관리자 설정 페이지

  - 배너 관리
  - 카테고리 관리
  - 관리자 계정 관리
<br>

- 다국어 기능 추가

  - `i18next` 라이브러리 사용
  - `npm install react-i18next i18next`
  - `npm install i18next-http-backend i18next-browser-languagedetector`
  - (i18next 참고)[https://react.i18next.com/latest/using-with-hooks]
<br>

- 무한 스크롤 기능

  - `hooks/useInfiniteScroll`
  - `IntersectionObserver` 사용
<br>

- 상품 필터, 정렬, 검색, 좋아요 기능 추가
<br>

- 경매 시간 카운트 추가
  - `react-countdown` 라이브러리

<br>

- Banner Carousel 기능 추가
  - `npm install react-material-ui-carousel`
<br>

- JWT 인증 구현
<br>

- 2FA(Goole OTP) 구현

  - 키 생성, RESERT
  - `users` 테이블에 컬럼 추가
  - 라이브러리: `speakeasy`, `qrcode`

- 상품 경매, 판매 등록

  - 이미지 파일을 선택하고 정보 입력 후 등록 시 Mint 되고 ipfs, db에 저장

- ~~이미지 업로드 (`multer`)~~ => ipfs 저장으로 수정
  - `formData` 와 `{ header: { "content-type": "multipart/form-data" }` 를 사용하여 request를 보내야 한다.
  - `file` 타입의 `input`은 그냥 body에 넣어서 보내면 빈 객체만 보여짐.
  - `file`과 같이 데이터를 보내기 위해 `formData.append('body', JSON.stringfy(body))`를 사용함
  
<br>

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

    - interval을 줘서 views 테이블에 한 번에 할 수 있도록 함. (2-3시간 간격)

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
<br>

- 시간 지난 상품 `onMarket` column - false 설정 (`marketplaces.cotroller`)
  - `/bid` 경로에서 모든 제품을 불러올 때 시간 확인, `onMarket` 업데이트
  - 대체 옵션1: db trigger
  - 대체 옵션2: db 프로시저
  - 대체 옵션3: 해당 상품 상세페이지 들어갈 때 시간비교 => 안들어갈 때 문제

<br>

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
  
<br><br>

# 설치 및 실행 (ubuntu)
- front, server 각각 폴더에서 `sudo npm install`
- server에서 `npm install nodemon`

- `truffle-config.js` 설정 변경
- front 폴더 안에서 `truffle compile`, `truffle migration` 실행

- `ipconfig.json` url 변경 ( “IP” 만 해당 서버 url로 변경)

- ipfs 설치
  - `npm install -g ipfs`
  - `jsipfs init`
  - `jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"POST\", \"GET\"]'`
  - `jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"*\"]'`
  - `jsipfs daemon`

- 실행
  - front, server 각각 폴더에서 `sudo npm start`

<br><br>

# 디렉토리
## Client: React
- components
  - ConnectMetamask: 초기 Metamask 접속화면
  - Navbar
  - Loading
  - Card
  - Input
  - Button

- pages
  - Analysis: 분석 페이지
  - home: 홈 페이지
  - Login: 로그인 페이지
  - Marketplace: 마켓플레이스 페이지
  - MyImage: MyTokens 페이지
  - ProductDetail: 마켓플레이스에 있는 상품 상세 페이지
  - Profile: 프로필 페이지
  - Register: 회원가입 페이지
  - setting: 셋팅 페이지
  - UserList: 사용자 목록 페이지
  - UserUpload: Mint 페이지

- Auth.js: 페이지 이동 시 해당 권한 체크 기능 
- app.js에서 넘겨주는 페이지 권한을 기준으로 해당 사용자가 가진 권한 비교

- hooks
  - useInfiniteScroll.js: 무한 스크롤 기능
  - useInputreduce.js: 회원 가입 등에 입력 값 받는 기능
  - usePagination.js: 페이지네이션 기능, 무한 스크롤로 대체
  - useScroll, useInput 사용 x

- locales
  - 다국어 기능
  ```
  "Navbar": {
      "mytokens": "MyTokens",

  위처럼 정의 후 아래처럼 사용

  import i18next from "i18next";
  import { useTranslation } from "react-i18next";
  // …

  const { t, i18n } = useTranslation();
  const getLanguage = () => i18next.language || window.localStorage.i18nextLng;
  //…

  return (
  <Link to="/myimages" className="nav-link">
              {t("Navbar.mytokens")}
        </Link>
  )
  ```

- store: react-redux 사용
  - 로그인, 로그아웃, 유저 정보 변경 등 기능
  - 크롬 ReduxDevtools 설치하면 현재 유저 정보 등 확인 가능

- util
  - getBase64.js: mint 시 이미지 파일 암호화 기능 분리
  - ViewCounts.js: view 카운트 기능 정의
  - setupProxy.js: node 서버와 통신하기 위한 프록시 설정


### 라이브러리
- material-ui
- http-proxy-middleware (setupProxy.js)
- i18next: 다국어 기능
- react-material-ui-carousel: 홈 페이지 배너 Carousel 기능(슬라이드)
- axios
- dayjs
- ipfs-http-client
- react-countdown: 경매 상품의 경우 상품 목록에서 남은 시간을 보여준다.
- react-redux
- reduxjs/toolkit


<br><br>

## Server: Node.js (Express)
- app.js: 메인 파일, db 정의 라우팅 설정

- config
  - auth.config.js: JWT 시크릿 키, 만료 기한 등 설정 정보
  - db.config.js: postgres 설정 정보
  - email.config.js: 회원 가입 시 이메일 전송 정보(이메일 변경해야 합니다.)

- controllers: DB 기능(쿼리)
  - views.controller.js: view 카운트 기능, setIntervalQuery에서 시간 지정하여 한 번에 DB에 쌓음(시간 변경 or 바로 되도록 수정해도 됨)

- middleware
  - authJWT.js: 토큰, 이메일 등으로 권한 인증
  - multerFile.js: 이미지 업로드, 현재 사용 x
  - verifySignUp.js: 회원가입 시 권한이 미리 정의되어 있는지

- models: DB(테이블 등) 정의, 테이블이 없어도 자동 생성됨
- routes: 라우팅 정의
<br>


### 라이브러리
- 메일 전송: nodemailer (회원가입)
- DB: sequelize(쿼리 대신 controllers 소스처럼 디비 사용사능), pg, pg-hstore, sequelize
- JWT: jsonwebtoken (로그인 시 생성하여 클라이언트에 토큰을 보내줌)
- 2FA: speakeasy, qrcode
- bcrypt

<br><br>

## DB 구조
<img src="https://github.com/in3166/nft_shopping_mall/blob/master/images/ERD.PNG" width="80%" />
<br><br>

## 수정 사항

- 같은 이미지의 경우 mint 방지 => hash url
  - `ImageContract.sol`
    - `require(!_imageExists[_hash], "ERC721: token already minted");` 추가
<br><br>

# EC2 Ubuntu에 올리기
- (nvm)node, (python2.7-), truffle, ganache-cli 설치
```
$ sudo apt-get update
$ sudo apt-get -y upgrade
$ sudo apt install -y build-essential

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc
nvm install v16.13.0
```
```
[npm install 시 sudo npm intall => command not found] 
n=$(which node); \
n=${n%/bin/node}; \
chmod -R 755 $n/bin/*; \
sudo cp -r $n/{bin,lib,share} /usr/local
-----
[EC2 보안- 아웃바운드 규칙 433 -> Anyware]
sudo npm install
```
- ganache-cli 실행: `ganache-cli --host 0.0.0.0`
- truffle compile / migrate
- ipfs 설치 및 실행

- DB 연결 (PostgresSQL)
  - local 설치
  - `config/db.config.js`에 환경설정


### 메타 마스크 연결
- RPC URL: `http://주소:8545`
- Chain Id: 1337
- 계정 비밀키 등록

### SERVER GIT CLONE
- git clone -
- npm install
- 파일 생성
  - server
    - config (`auth.confing.js`, `db.config.js`, `email.config.js`)

  - nft-marketplace
   - `.env.development`, `.env.production`

- `truffle-config.js` 설정 변경
- `ipconfig.json` 설정 변경
- 하드코딩 url 변경
  - server: `users.controller.js` 메일 주소
  - client
    - `UploadAuction.js`
    - `UploadSale.js`

<br><br>

# 추가 계획
- 로그 찍기
- 서버 요청 시 권한 인증 방법 수정 (email => token)
- page 이동 혹은 서버 요청 시 권한(만료) 체크 더 구체적으로 설계
- url 분리 => `const`
- catch error message: `err.response.data.message.detail` 수정
- 상품 판매 시 배너에 있으면 배너에서 제거, 시간 초과 시에도 동일

<br><br><br>

<hr>

<br><br>

# 참고 사항
- `err.response.data.message` 서버에서 받은 에러메세지
- 컨트랙스 수정 후 재실행

  - `truffle compile`
  - `truffle migrate --reset`

- sequelize migration - undo
- winsoton, morgan - logger
- `useInputReduce`에서 initalValue 내려줄 때 동일한 객체(전역?)를 내려주면 값을 공유하게 됨 => 객체를 새롭게

- ubuntu PostgreSQL: `Connection Refused`
  - `sudo service postgresql restart`

<br>

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

- `jsipfs: execution of scription is disabled on this system`
  - powershell 실행 제한 불가, 관리자 권한으로 실행
  - `get-help Set-ExecutionPolicy`
  - `Update-Help`
  - `Set-ExecutionPolicy RemoteSigned` 

- `Uncaught DOMException: Failed to set the 'value' property on 'HTMLInputElement': This input element accepts a filename, which may only be programmatically set to the empty string.`
  - `key={file?.filename}`: key 설정하기!
  - `value={file?.filename}`: file.name or file은 안됨
  - 키를 설정하지 않으면 submit 후 reset 시 filename이 남아있음

- 메모리 누수 경고는 컴포넌트 별로 따로 해줘야 한다. (자식 컴포넌트 따라)

- `err find python` (ipfs 실행 x)
  - admin powershell: `npm install --global windows-build-tools`
  - windows 의존성 설치가 안되어 있어서
  - 이것 또한 다운로드가 멈춰서 안됨 => choco install 사용
  - `Set-ExecutionPolicy Bypass -Scope Process` in Powershell
  - `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))`
  - `choco install python visualcpp-build-tools`
  - `npm config set msvs_version 2017`

## error
- git push 시 하위 폴더 에러 (`modified content, untracked content`)

  - `.git` 폴더 삭제
  - `git rm -rf --cached`

- Class component history 사용: 해당 컴포넌트를 `withRouter`로 감싸서 export
