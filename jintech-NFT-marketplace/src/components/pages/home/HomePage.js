import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import { useTranslation } from "react-i18next";

const images = [
  {
    imageData_token: "toeken11111",
    imageData_price: 121,
    imageData_name: "image1",
    imageData_url: "/url1",
  },
  {
    imageData_token: "toeken22",
    imageData_price: 222,
    imageData_name: "image2",
    imageData_url: "/url2",
  },
  {
    imageData_token: "toeken33",
    imageData_price: 333,
    imageData_name: "image3",
    imageData_url: "/url3",
  },
  {
    imageData_token: "toeken4",
    imageData_price: 444,
    imageData_name: "image4",
    imageData_url: "/url4",
  },
  {
    imageData_token: "toeken5",
    imageData_price: 555,
    imageData_name: "image5",
    imageData_url: "/url5",
  },
];

const HomePage = (props) => {
  const { t, i18n } = useTranslation();
  const handleClick = (lang) => {
    i18n.changeLanguage(lang);
    console.log(t("title"));
  };

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
        {images.map((val, key) => (
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
                  <img
                    alt="token"
                    className="token"
                    src={images[key].imageData_url}
                  />
                </div>
                <div className="token-box-info token-name">
                  Name
                  <span className="token-data">
                    {images[key].imageData_name}
                  </span>
                </div>
                <div className="token-box-info token-price">
                  Price
                  <span className="token-data">
                    {images[key].imageData_price}
                    <span className="token-eth">ETH</span>
                  </span>
                </div>
                <div className="token-box-info token-id">
                  Token ID
                  <span className="token-data">
                    {images[key].imageData_token}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 21.11.26 페이지 넘기는 부분 */}
      <div className="market-pager d-flex">
        <span className="page-control-btn page-arrow flex-wrap">
          <i className="fas fa-chevron-left"></i>Prev
        </span>
        <span className="page-control-btn flex-wrap">
          <span className="page-number select-page nft-primary">1</span>
          {/* 선택된 페이지 */}
          {/* 임시 */}
          <span className="page-number another-page">2</span>
          <span className="page-number another-page">3</span>
        </span>
        <span className="page-control-btn page-arrow flex-wrap">
          Next
          <i className="fas fa-chevron-right"></i>
        </span>
      </div>
      <button onClick={() => handleClick("en")}>En</button>
      <button onClick={() => handleClick("ko")}>Ko</button>
      <div>
        <p>{t("Thanks.1")}</p>
      </div>
    </div>
  );
};

export default HomePage;
