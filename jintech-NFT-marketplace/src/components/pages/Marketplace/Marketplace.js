import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ViewCounts from "../../../util/ViewCounts";
import styles from "./Marketplace.module.css";
import SearchOffIcon from "@mui/icons-material/SearchOff";
const Marketplace = () => {
  const user = useSelector((state) => state.user.user);
  const [Images, setImages] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [SelectedCategory, setSelectedCategory] = useState(0);
  const getAllImages = useCallback(async () => {
    // .then((res) => {
    //   console.log(res.data);
    //   ViewCounts(window.location.pathname, user.email);
    //   setImages(res.data);
    // })
    // .catch((err) => {
    //   console.log(err);
    // });

    const imagesRes = await axios.get("/api/marketplaces/", {
      headers: { email: user.email },
    });
    const categoryRes = await axios.get("/api/categories");
    ViewCounts(window.location.pathname, user.email);
    console.log(imagesRes.data);
    console.log(categoryRes);
    setImages(imagesRes.data);
    setCategories(categoryRes.data.data);
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

  const handleCategoryChange = (e) => {
    console.log(e.target.value);
    setSelectedCategory(e.target.value);
  };

  return (
    <Box>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1.3rem",
        }}
      >
        <div style={{ maxWidth: "250px", width: "100%" }}>
          <select onChange={handleCategoryChange}>
            <option value={0}>All</option>
            {Categories.length > 0 &&
              Categories.map((value, index) => (
                <option value={value.id} key={value.id}>
                  {value.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <input tpye="text" />
          <button>검색</button>
        </div>
      </div>
      {Images.length === 0 && (
        <div className={styles.empty}>
          <SearchOffIcon className={styles.icon} /> No Items.
        </div>
      )}
      {Images.length > 0 &&
        Images.filter(
          (value, index) =>
            SelectedCategory === 0 ||
            SelectedCategory === value.image.categoryId
        ).map((value, index) => (
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
                  <img alt="token" className="token" src={value?.image?.url} />
                </div>
                <div className="token-box-info token-name">
                  Name
                  <span className="token-data">{value?.image?.filename}</span>
                </div>
                <div className="token-box-info token-price">
                  Price
                  <span className="token-data">
                    {value?.current_price}
                    <span className="token-eth">ETH</span>
                  </span>
                </div>
                <div className="token-box-info token-id">
                  Token ID
                  <span className="token-data">{value?.token}</span>
                </div>
                <div className={styles["count-container"]}>
                  <Countdown
                    date={
                      new Date(value.starting_time).getTime() +
                      value?.limit_hours * 60 * 60 * 1000
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
