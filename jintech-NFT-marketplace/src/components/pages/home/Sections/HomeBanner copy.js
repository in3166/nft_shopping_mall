import { Card } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import "../HomePage.css";
import $ from "jquery"; // jquery 사용

const HomeBanner = (props) => {
  const { Banners } = props;

  function autoSlide() {
    $("#slideWrap").carousel({
      interval: 1000,
      // pause: "hover" 마우스 올리면 멈춤
    });

    // for (let i=0; i <= $('.carousel-item').length; i++) {
    //   $("#slidePanel" + i).on('click', function(){
    //     $("#slideWrap").carousel(i);
    //   });
    // };

    $(".prev-btn").on("click", function () {
      $(".slide-items").carousel("prev");
    });
    $(".next-btn").on("click", function () {
      $(".slide-items").carousel("next");
    });
  }

  window.onload = function mainSlide() {
    autoSlide(); // 메인 슬라이드 부분
  };

  useEffect(() => {}, []);

  return (
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
          {Banners.map((value, index) => {
            if (index === 0)
              return (
                <li
                  key={`slide-${index}`}
                  className="active"
                  data-target="#slideWrap"
                  data-slide-to="0"
                ></li>
              );
            else
              return (
                <li
                  key={`slide-${index}`}
                  data-target="#slideWrap"
                  data-slide-to={index}
                ></li>
              );
          })}
        </ul>

        <ul className="carousel-inner">
          {Banners.map((value, index) => {
            return (
              <li
                className={`index ${index === 0 && "active"}`}
                key={`list-${index}`}
              >
                <Link to={`/nft-detail/${value.key}`}>
                  <Card
                    sx={{
                      opacity: 0.5,
                      position: "absolute",
                      left: 30,
                      bottom: 30,
                      height: "max-content",
                      textAlign: "left",
                      padding: 3,
                      fontWeight: 600,
                      fontSize: "0.99rem",
                    }}
                  >
                    <div>
                      <strong>Name: {value.name}</strong>
                    </div>
                    <div>
                      <strong>Owner: {value.owner}</strong>
                    </div>
                    <div>
                      <strong>Price: {value.price} ETH</strong>
                    </div>
                  </Card>
                  <img
                    id="slideImg0"
                    src={value.url}
                    alt="slideImg0"
                    className="w-100"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default HomeBanner;
