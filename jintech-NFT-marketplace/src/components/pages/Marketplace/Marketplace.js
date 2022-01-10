import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./Marketplace.module.css";

const Marketplace = () => {
  const user = useSelector((state) => state.user.user);
  const [Images, setImages] = useState([]);

  const getAllImages = useCallback(() => {
    axios
      .get("/api/marketplaces/", {
        headers: { email: user.email },
      })
      .then((res) => {
        console.log(res.data);
        setImages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.email]);

  useEffect(() => {
    getAllImages();
  }, [getAllImages]);

  const countRenderer = (data) => {
    // Render a countdown

    return (
      <span className={styles["count_container"]}>
        <span className={styles["count_item"]}>{data.formatted.days}</span>:
        <span className={styles["count_item"]}>{data.formatted.hours}</span>:
        <span className={styles["count_item"]}>{data.formatted.minutes}</span>:
        <span className={styles["count_item"]}>{data.formatted.seconds}</span>
      </span>
    );
  };

  return (
    <Box>
      {Images.length !== 0 &&
        Images.map((value, index) => (
          <div className="product-pages-list flex-wrap p-1 m-4" key={value.id}>
            <div className="card-wrap flex-row card">
              {/* 2021.11.26 스타일 이동(div로 한 번 더 묶음 */}
              <Link
                to={{
                  pathname: `/goods/${value.id}`,
                  // state: {name: "vikas"}
                }}
              >
                <div className="token-box col-auto">
                  {/* 2021.11.26 텍스트 구분 */}
                  <img alt="token" className="token" src={value.image.url} />
                </div>
                <div className="token-box-info token-name">
                  Name
                  <span className="token-data">{value.image.filename}</span>
                </div>
                <div className="token-box-info token-price">
                  Price
                  <span className="token-data">
                    {value.current_price}
                    <span className="token-eth">ETH</span>
                  </span>
                </div>
                <div className="token-box-info token-id">
                  Token ID
                  <span className="token-data">{value.token}</span>
                </div>
                <div className={styles["count-container"]}>
                  <Countdown
                    date={
                      new Date(value.starting_time).getTime() +
                      value.limit_hours * 60 * 60 * 1000
                    }
                    renderer={countRenderer}
                  />
                </div>
              </Link>
            </div>
          </div>
        ))}
    </Box>
  );
};

export default Marketplace;
