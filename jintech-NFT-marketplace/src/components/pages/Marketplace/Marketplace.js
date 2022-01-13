import { Card, Grid, Button, Input } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ViewCounts from "../../../util/ViewCounts";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import styles from "./Marketplace.module.css";

const Marketplace = () => {
  const user = useSelector((state) => state.user.user);
  const [Images, setImages] = useState(undefined);
  const [OriginalImages, setOriginalImages] = useState(Images);
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
    setOriginalImages(imagesRes.data);
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
  console.log("Images: ", Images);
  const [SearchText, setSearchText] = useState("");
  const handleSearchClick = () => {
    console.log(SearchText);
    if (SearchText === "" && OriginalImages.length > 0) {
      setImages(OriginalImages);
    } else if (SearchText !== "" && OriginalImages.length > 0) {
      //setOriginalImages(Images);
      setImages(OriginalImages.filter((v) => v.image.filename.includes(SearchText)));
    }
  };

  return (
    <Box className={styles.box}>
      <div className={styles.header}>
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
        <div style={{ alignSelf: "center" }}>
          <Input
            type="text"
            value={SearchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            color="inherit"
            variant="outlined"
            style={{ marginLeft: 10 }}
            size="small"
            onClick={handleSearchClick}
          >
            검색
          </Button>
        </div>
      </div>

      {(Images?.length === 0 ||
        Images?.filter(
          (value, index) =>
            Number(SelectedCategory) === 0 ||
            Number(SelectedCategory) === Number(value.image.categoryId)
        ).length === 0) && (
        <div className={styles.empty}>
          <SearchOffIcon className={styles.icon} /> No Items.
        </div>
      )}

      <Grid container columns={24} spacing={4} padding={3}>
        {Images?.length > 0 &&
          Images.filter(
            (value, index) =>
              Number(SelectedCategory) === 0 ||
              Number(SelectedCategory) === Number(value.image.categoryId)
          ).map((value, index) => (
            <Grid item xs={24} sm={12} md={8} lg={6} key={value.id}>
              <Link
                to={{
                  pathname: `/goods/${value.id}`,
                  // state: {name: "vikas"}
                }}
              >
                <Card
                  className={styles["card-wrap"]}
                  title={value?.image?.filename}
                >
                  {/* 2021.11.26 스타일 이동(div로 한 번 더 묶음 */}
                  <div className={styles.imageBox}>
                    {/* 2021.11.26 텍스트 구분 */}
                    <img
                      alt="token"
                      className={styles.image}
                      src={value?.image?.url}
                    />
                  </div>
                  <div className={styles.infoBox}>
                    <div
                      className="token-box-info token-name"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Name
                      <span className="token-data">
                        {value?.image?.filename}
                      </span>
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
                </Card>
              </Link>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Marketplace;
