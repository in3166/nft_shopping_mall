import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import { useTranslation } from "react-i18next";
import ImageContract from "../../../abis/ImageContract.json";
import TokenSaleContract from "../../../abis/TokenSaleContract.json";
import { Pagination } from "@mui/material";
import usePagination from "../../../hooks/usePagination";

const HomePage = (props) => {
  const { t } = useTranslation();
  const [Images, setImages] = useState([]);
  const [TokenPrice, setTokenPrice] = useState(0);

  const PER_PAGE = 8;
  const _DATA = usePagination(Images, PER_PAGE);
  const [page, setPage] = useState(1);

  const handlePageChange = (e, page) => {
    setPage(page);
    _DATA.jump(page);
  };

  const getAllImages = async () => {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const networkData = ImageContract.networks[networkId];

    if (networkData) {
      const abi = ImageContract.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      const totalSupply = await contract.methods.totalSupply().call();

      let temp = [];
      // Load NFTs
      for (var i = 1; i <= totalSupply; i++) {
        const id = await contract.methods.images(i - 1).call();
        const owner = await contract.methods.ownerOf(i - 1).call();
        const metadata = await contract.methods.imageData(i - 1).call();
        temp = [
          ...temp,
          {
            id,
            owner,
            name: metadata.name,
            price: metadata.price,
            token: metadata.token,
            url: metadata.url,
          },
        ];
      }
      setImages(temp);
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }

    const sale_networkData = TokenSaleContract.networks[networkId];
    if (sale_networkData) {
      const abi = TokenSaleContract.abi;
      const address = sale_networkData.address;
      const token_sale_contract = new web3.eth.Contract(abi, address);
      if (token_sale_contract) {
        var token_price = await token_sale_contract.methods.tokenPrice().call();
        setTokenPrice(web3.utils.fromWei(token_price, "ether"));
      }
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }
  };

  useEffect(() => {
    getAllImages();
  }, []);
  console.log(Images.length);

  return (
    <div className="contents">
      {/* 2021.11.26 main img slide 추가 */}
      <div className="slide-contents">
        <div id="slideWrap" className="carousel slide" data-ride="carousel">
          <div className="slide-control-inner">
            <a
              className="control-btn prev-btn"
              href="#slideWrap"
              data-slide="prev"
              type="button"
            >
              <i className="fas fa-chevron-left"></i>
            </a>
            <a
              className="control-btn next-btn"
              href="#slideWrap"
              data-slide="next"
              type="button"
            >
              <i className="fas fa-chevron-right"></i>
            </a>
          </div>

          <ul className="carousel-indicators">
            <li
              className="active"
              data-target="#slideWrap"
              data-slide-to="0"
            ></li>
            <li data-target="#slideWrap" data-slide-to="1"></li>
            <li data-target="#slideWrap" data-slide-to="2"></li>
            <li data-target="#slideWrap" data-slide-to="3"></li>
            <li data-target="#slideWrap" data-slide-to="4"></li>
          </ul>
          <ul className="carousel-inner">
            <li className="carousel-item active">
              <a href="#">
                <img
                  id="slideImg0"
                  src="https://url.kr/xq4nko"
                  alt="slideImg0"
                  className="w-100"
                />
              </a>
            </li>
            <li className="carousel-item">
              <a href="#">
                <img
                  id="slideImg1"
                  src="https://url.kr/nj1u9e"
                  alt="slideImg1"
                  className="w-100"
                />
              </a>
            </li>
            <li className="carousel-item">
              <a href="#">
                <img
                  id="slideImg2"
                  src="https://url.kr/5d71n6"
                  alt="slideImg2"
                  className="w-100"
                />
              </a>
            </li>
            <li className="carousel-item">
              <a href="#">
                <img
                  id="slideImg3"
                  src="https://url.kr/ue2iq9"
                  alt="slideImg3"
                  className="w-100"
                />
              </a>
            </li>
            <li className="carousel-item">
              <a href="#">
                <img
                  id="slideImg4"
                  src="https://url.kr/2gyjz8"
                  alt="slideImg4"
                  className="w-100"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* 2021.11.26 main img slide 끝 */}

      <div className="card page-head">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            {t("home.title")}
            {/* 20211108 주석 처리 {totalTokensMinted} */}
          </h5>
        </div>
      </div>
      <div className="product-page flex-wrap">
        {_DATA.currentData().map((val, key) => (
          <div key={key} className="product-pages-list flex-wrap">
            <div className="card-wrap flex-row card">
              {/* 2021.11.26 스타일 이동(div로 한 번 더 묶음 */}
              <Link
                to={{
                  pathname: `/nft-detail/${key}`,
                  // state: {name: "vikas"}
                }}
              >
                <div className="token-box col-auto">
                  {" "}
                  {/* 2021.11.26 텍스트 구분 */}
                  <img alt="token" className="token" src={Images[key].url} />
                </div>
                <div className="token-box-info token-name">
                  Name
                  <span className="token-data">{Images[key].name}</span>
                </div>
                <div className="token-box-info token-price">
                  Price
                  <span className="token-data">
                    {Images[key].price * TokenPrice}
                    <span className="token-eth">ETH</span>
                  </span>
                </div>
                <div className="token-box-info token-id">
                  Token ID
                  <span className="token-data">{Images[key].token}</span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 21.11.26 페이지 넘기는 부분 */}
      <div className="market-pager d-flex">
        <Pagination
          //count={10}
          color="primary"
          page={page}
          siblingCount={1}
          boundaryCount={1}
          count={Math.ceil(Images.length / PER_PAGE)}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default HomePage;
