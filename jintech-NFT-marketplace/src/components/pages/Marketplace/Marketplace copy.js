import {
  Card,
  Grid,
  Button,
  Input,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Pagination,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ViewCounts from "../../../util/ViewCounts";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import styles from "./Marketplace.module.css";
import LoadingSpinner from "../../UI/Loading/LoadingSpinner";
import usePagination from "../../../hooks/usePagination";

const Marketplace = ({ location }) => {
  let query = location.pathname.split("/");
  query = query[query?.length - 1];

  const user = useSelector((state) => state.user.user);
  const [Images, setImages] = useState(undefined);
  const [OriginalImages, setOriginalImages] = useState(Images);
  const [Categories, setCategories] = useState([]);
  const [SelectedCategory, setSelectedCategory] = useState(0);
  const [SelectedType, setSelectedType] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [isMounted, setisMounted] = useState(true);

  const getAllImages = useCallback(async () => {
    setLoading(true);
    setisMounted(true);
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
    console.log("imagesRes: ", imagesRes);
    console.log(categoryRes);
    console.log("query: ", query);
    if (query !== "" && query !== "bid" && query !== "/") {
      setImages(imagesRes.data.images.filter((v) => v.name.includes(query)));
    } else {
      setImages(imagesRes.data.images);
    }
    setOriginalImages(imagesRes.data.images);
    setCategories(categoryRes.data.data);
    if (isMounted) setLoading(false);
  }, [user.email, isMounted, query]);

  useEffect(() => {
    getAllImages();
    return () => {
      setisMounted(false);
    };
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
    setSelectedCategory(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  console.log("Images: ", Images);
  const [SearchText, setSearchText] = useState("");
  const handleSearchClick = () => {
    console.log(SearchText);
    if (SearchText === "" && OriginalImages.length > 0) {
      setImages(OriginalImages);
    } else if (SearchText !== "" && OriginalImages.length > 0) {
      //setOriginalImages(Images);
      setImages(OriginalImages.filter((v) => v.name.includes(SearchText)));
    }
  };

  // pagination
  const PER_PAGE = 8;
  const _DATA = usePagination(Images, PER_PAGE);
  const [page, setPage] = useState(1);

  const handlePageChange = (e, page) => {
    setPage(page);
    _DATA?.jump(page);
  };

  return (
    <Box className={styles.box}>
      <div className={styles.header}>
        <div className={styles["header-select"]}>
          <FormControl className={styles["header-select-category"]}>
            <InputLabel id="categories-select-label">Category</InputLabel>
            <Select
              labelId="categories-select-label"
              id="categories-select"
              onChange={handleCategoryChange}
              size="small"
              label="Category"
              value={SelectedCategory}
            >
              <MenuItem value={0}>All</MenuItem>
              {Categories.length > 0 &&
                Categories.map((v) => (
                  <MenuItem value={v.id} key={v.id}>
                    {v.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl className={styles["header-select-type"]}>
            <InputLabel id="categories-select-label2">Type</InputLabel>
            <Select
              labelId="categories-select-label2"
              id="categories-select2"
              onChange={handleTypeChange}
              size="small"
              label="Type"
              value={SelectedType}
            >
              <MenuItem value={0}>All</MenuItem>
              <MenuItem value="sale">Fixed Price</MenuItem>
              <MenuItem value="auction">Live Auction</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={styles["header-search"]}>
          <Input
            type="text"
            value={SearchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles["header-search-input"]}
          />
          <Button
            color="inherit"
            variant="outlined"
            className={styles["header-search-button"]}
            size="small"
            onClick={handleSearchClick}
          >
            검색
          </Button>
        </div>
      </div>

      {Loading && <LoadingSpinner />}

      {!Loading &&
        (Images?.length === 0 ||
          Images?.filter(
            (value, index) =>
              (Number(SelectedCategory) === 0 ||
                Number(SelectedCategory) === Number(value.categoryId)) &&
              (Number(SelectedType) === 0 || SelectedType === value.type)
          ).length === 0) && (
          <div className={styles.empty}>
            <SearchOffIcon className={styles.icon} /> No Items.
          </div>
        )}

      <Grid container columns={24} spacing={4} padding={3}>
        {!Loading &&
          Images?.length > 0 &&
          Images.filter(
            (value, index) =>
              (Number(SelectedCategory) === 0 ||
                Number(SelectedCategory) === Number(value.categoryId)) &&
              (Number(SelectedType) === 0 || SelectedType === value.type)
          ).map((value, index) => (
            <Grid item xs={24} sm={12} md={8} lg={6} key={value.id}>
              <Link
                to={{
                  pathname: `/goods/${value.id}`,
                  // state: {name: "vikas"}
                }}
              >
                <Card className={styles["card-wrap"]} title={value?.name}>
                  {/* 2021.11.26 스타일 이동(div로 한 번 더 묶음 */}
                  <div className={styles.imageBox}>
                    {/* 2021.11.26 텍스트 구분 */}
                    <img
                      alt="token"
                      className={styles.image}
                      src={value?.url}
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
                      <span className="token-data">{value?.name}</span>
                    </div>
                    <div className="token-box-info token-price">
                      Price
                      <span className="token-data">
                        {value?.current_price.toLocaleString()}
                        <span className="token-eth">ETH</span>
                      </span>
                    </div>
                    <div className="token-box-info token-id">
                      Owner
                      <span className="token-data">{value?.ownerEmail}</span>
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
      {!Loading && (
        <div className="market-pager d-flex">
          <Pagination
            //count={10}
            color="primary"
            page={page}
            siblingCount={1}
            boundaryCount={1}
            count={Math.ceil(Images?.length / PER_PAGE)}
            onChange={handlePageChange}
          />
        </div>
      )}
    </Box>
  );
};

export default Marketplace;
