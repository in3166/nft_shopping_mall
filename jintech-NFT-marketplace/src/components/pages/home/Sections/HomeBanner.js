import { Card } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import "../HomePage.css";
import Carousel from "react-material-ui-carousel";
import styles from "./HomeBanner.module.css";
const HomeBanner = (props) => {
  const { Banners } = props;

  useEffect(() => {}, []);
  const [index, setIndex] = React.useState(0);

  const handleChange = (cur, prev) => {
    setIndex(cur);
    console.log(cur, prev);
  };

  return (
    <div>
      <Carousel
        index={index}
        onChange={handleChange}
        interval={4000}
        animation="slide"
        indicators={true}
        stopAutoPlayOnHover
        swipe
        indicatorIconButtonProps={{
          style: {
            zIndex: 999,
          },
        }}
        activeIndicatorIconButtonProps={{
          style: {
            zIndex: 999,
          },
        }}
        className="my-carousel"
      >
        {Banners.map((value, i) => {
          return (
            <div className={styles["carousel-item"]} key={`list-${i}`}>
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
            </div>
          );
        })}
      </Carousel>
      {/* <ul className="carousel-indicators">
        {Banners.map((value, i) => {
          return (
            <li
              key={`slide-${i}`}
              className={index === i ? "active" : ""}
              data-target="#slideWrap"
              onClick={() => setIndex(i)}
              data-slide-to="0"
            ></li>
          );
        })}
      </ul> */}
    </div>
  );
};

export default HomeBanner;
