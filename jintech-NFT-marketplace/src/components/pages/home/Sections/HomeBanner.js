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
  };

  return (
    <div>
      <Carousel
        index={index}
        onChange={handleChange}
        interval={5000}
        animation="slide"
        indicators={true}
        stopAutoPlayOnHover
        swipe
        indicatorContainerProps={{
          style: {
            position: "absolute",
            bottom: 0,
          },
        }}
        indicatorIconButtonProps={{
          style: {
            zIndex: 9999,
          },
        }}
        activeIndicatorIconButtonProps={{
          style: {
            zIndex: 9999,
          },
        }}
        className={styles["my-carousel"]}
      >
        {Banners.map((value, i) => {
          return (
            <Link to={`/nft-detail/${value.id}`} key={`list-${i}`}>
              <div className={styles["carousel-item"]} key={`list-${i}`}>
                <img
                  id="slideImg0"
                  src={value.url}
                  alt="slideImg0"
                  className={styles.image}
                />
              </div>
              <Card className={styles.info}>
                <div>
                  <strong>Name: {value.name}</strong>
                </div>
                <div>
                  <strong>Owner: {value.ownerEmail}</strong>
                </div>
                <div>
                  <strong>Price: {value.current_price} ETH</strong>
                </div>
              </Card>
            </Link>
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
