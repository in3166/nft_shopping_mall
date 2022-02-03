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
import FavoriteIcon from "@mui/icons-material/Favorite";

const Marketplace = ({ location }) => {
  let query = location.pathname.split("/");
  query = query[query?.length - 1];

  const user = useSelector((state) => state.user.user);
  const [Images, setImages] = useState(undefined);
  const [OriginalImages, setOriginalImages] = useState(Images);
  const [Categories, setCategories] = useState([]);
  const [SelectedCategory, setSelectedCategory] = useState(0);
  const [SelectedType, setSelectedType] = useState(0);
  const [SelectedSort, setSelectedSort] = useState(1);
  const [Loading, setLoading] = useState(false);
  const [isMounted, setisMounted] = useState(true);

  const getAllImages = useCallback(async () => {
    setLoading(true);
    setisMounted(true);

    const imagesRes = await axios.get("/api/marketplaces/", {
      headers: { email: user.email },
    });
    const categoryRes = await axios.get("/api/categories");
    // 조회수 등록
    ViewCounts(window.location.pathname, user.email);
    console.log("imagesRes: ", imagesRes);
    console.log(categoryRes);
    console.log("query: ", query);
    // nav bar 검색 시
    imagesRes.data.images = imagesRes.data.images.sort((a, b) => {
      return (
        new Date(a.starting_time).getTime() +
        a.limit_hours * 60 * 60 * 1000 -
        (new Date(b.starting_time).getTime() + b.limit_hours * 60 * 60 * 1000)
      );
    });

    if (query !== "" && query !== "bid" && query !== "/") {
      setImages(imagesRes.data.images.filter((v) => v.name.includes(query)));
    } else {
      setImages(imagesRes.data.images);
    }
    setOriginalImages(imagesRes.data.images);
    setCategories(categoryRes.data.data);
    if (isMounted) setLoading(false);
    console.log("isMounted: ", isMounted);
    console.log("Loading: ", Loading);
  }, [user.email, isMounted, query]);

  const [Likes, setLikes] = useState([]);
  const getAllLikes = () => {
    if (user.email && user.email !== "")
      axios
        .get("/api/favorites/" + user.email)
        .then((res) => {
          console.log("likes: ", res.data);
          setLikes(res.data);
        })
        .catch((err) => {
          alert(err);
        });
  };

  useEffect(() => {
    getAllImages();
    getAllLikes();
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
    setImages(
      OriginalImages.filter(
        (value, index) =>
          (Number(e.target.value) === 0 ||
            Number(e.target.value) === Number(value.categoryId)) &&
          (Number(SelectedType) === 0 || SelectedType === value.type)
      )
    );
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setImages(
      OriginalImages.filter(
        (value, index) =>
          (Number(SelectedCategory) === 0 ||
            Number(SelectedCategory) === Number(value.categoryId)) &&
          (Number(e.target.value) === 0 || e.target.value === value.type)
      )
    );
  };

  const handleSortChange = (num) => {
    setSelectedSort(num);
    switch (num) {
      // recently listed
      // recently listed
      case 0:
        setImages(
          Images.sort((a, b) => {
            return new Date(b.starting_time) - new Date(a.starting_time);
          })
        );
        break;
      // ending soon
      case 1:
        setImages(
          Images.sort((a, b) => {
            return (
              new Date(a.starting_time).getTime() +
              a.limit_hours * 60 * 60 * 1000 -
              (new Date(b.starting_time).getTime() +
                b.limit_hours * 60 * 60 * 1000)
            );
          })
        );
        break;
      // price low - high
      case 2:
        setImages(
          Images.sort((a, b) => {
            return a.current_price - b.current_price;
          })
        );
        break;
      // price high - low
      case 3:
        setImages(
          Images.sort((a, b) => {
            return b.current_price - a.current_price;
          })
        );
        break;

      default:
        break;
    }
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

  const _DATA = usePagination(
    Images?.length === undefined ? [] : Images,
    PER_PAGE
  );

  const [page, setPage] = useState(1);
  console.log("_data: ", _DATA);
  console.log("page: ", page);

  const handlePageChange = (e, page) => {
    setPage(page);
    _DATA?.jump(page);
  };

  // 좋아요
  const handleLikes = (e, marketplaceId) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("likes!");
    const body = {
      userEmail: user?.email,
      marketplaceId,
    };
    if (user.email && user.email !== "")
      axios
        .post("/api/favorites", body)
        .then((res) => {
          if (res.data.success) {
            if (res.data.status) {
              setLikes((prev) => [...prev, body]);
            } else {
              setLikes((prev) =>
                prev.filter((v) => v.marketplaceId !== body.marketplaceId)
              );
            }
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => alert(err));
  };

  return (
    <Box className={styles.box}>
      <div className={styles.header}>
        <div className={styles["header-select"]}>
          <FormControl className={styles["header-select-category"]}>
            <InputLabel id="categories-select-label">Categories</InputLabel>
            <Select
              labelId="categories-select-label"
              id="categories-select"
              onChange={handleCategoryChange}
              size="small"
              label="Categories"
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
            <InputLabel id="categories-select-label2">Sale Types</InputLabel>
            <Select
              labelId="categories-select-label2"
              id="categories-select2"
              onChange={handleTypeChange}
              size="small"
              label="Sale Types"
              value={SelectedType}
            >
              <MenuItem value={0}>All</MenuItem>
              <MenuItem value="auction">Live Auction</MenuItem>
              <MenuItem value="sale">Fixed Price</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.sorts}>
            <FormControl className={styles["header-select-sort"]}>
              <InputLabel id="categories-select-label3">Sorts</InputLabel>
              <Select
                labelId="categories-select-label3"
                id="categories-select3"
                onChange={(e) => handleSortChange(e.target.value)}
                size="small"
                label="Sorts"
                value={SelectedSort}
              >
                <MenuItem value={0}>Recently listed</MenuItem>
                <MenuItem value={1}>Ending soon</MenuItem>
                <MenuItem value={2}>Price low - high</MenuItem>
                <MenuItem value={3}>Price high - low</MenuItem>
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
      </div>

      {Loading && <LoadingSpinner />}

      {!Loading && Images?.length === 0 && (
        <div className={styles.empty}>
          <SearchOffIcon className={styles.icon} /> No Items.
        </div>
      )}
      {/*&&
          Images?.length > 0 &&
          Images.filter(
            (value, index) =>
              (Number(SelectedCategory) === 0 ||
                Number(SelectedCategory) === Number(value.categoryId)) &&
              (Number(SelectedType) === 0 || SelectedType === value.type)
          )*/}

      <Grid container columns={24} spacing={4} padding={3}>
        {!Loading &&
          _DATA.currentData().map((value, index) => (
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
                    <div
                      onClick={(e) => handleLikes(e, value.id)}
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "3px",
                        backgroundColor: "rgba(66, 66, 66, 0.89)",
                        color: "white",
                        padding: "3px",
                        textAlign: "center",
                        borderRadius: "30%",
                      }}
                    >
                      {Likes.filter((like) => like.marketplaceId === value.id)
                        .length > 0 ? (
                        <FavoriteIcon fontSize="small" sx={{ color: "red" }} />
                      ) : (
                        <FavoriteIcon fontSize="small" />
                      )}
                    </div>
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
            count={Math.ceil(
              (Images?.length > 0 ? Images?.length : 0) / PER_PAGE
            )}
            onChange={handlePageChange}
          />
        </div>
      )}
    </Box>
  );
};

export default Marketplace;
