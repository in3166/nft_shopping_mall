import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import styles from "./MyImage.module.css";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import LoadingSpinner from "../../UI/Loading/LoadingSpinner";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";

const MyImage = (props) => {
  const { authChecked } = props;
  const history = useHistory();
  const user = useSelector((state) => state.user.user);
  const [Images, setImages] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [isMounted, setisMounted] = useState(true);
  const [count, setCount] = useState(6);
  const [OriginalImages, setOriginalImages] = useState([]);
  const [OriginalFilteredImages, setOriginalFilterdImages] = useState([]);

  console.log("immmage : ", Images);
  console.log("count : ", count);

  const getAllMyImages = useCallback(() => {
    setLoading(true);
    axios
      .get("/api/marketplaces/myimages/" + user.email)
      .then((res) => {
        if (res.data.success) {
          setOriginalImages(res.data.images);
          setOriginalFilterdImages(res.data.images);
          setImages(res.data.images.filter((v, k) => k < count));
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert("가져오기 Error: ", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
  }, [user.email, isMounted]);

  const getAccount = useCallback(async () => {
    setLoading(true);
    const accounts = await window.web3.eth.getAccounts();
    console.log(accounts[0]);
    console.log("user: ", user);
    if (accounts && user.email !== "") {
      if (user.userAddress !== accounts[0]) {
        alert("지갑 주소가 맞지 않습니다.");
        history.replace("/");
      }

      // await axios
      //   .get(`/api/users/user/${user.email}`)
      //   .then((res) => {
      //     console.log("res : ", res.data.address);
      //     if (accounts[0] !== res.data.address) {
      //       if (user.isLoggedIn && authChecked) {
      //         alert("지갑 주소가 맞지 않습니다. 1");
      //         history.replace("/");
      //       }
      //       //user.walletAddress = accounts[0];
      //     }
      //   })
      //   .catch((err) => {
      //     console.log("err: ", err);
      //   });
    }
    if (isMounted) setLoading(false);
  }, [history, user, isMounted]);

  const [ref, setRef] = useInfiniteScroll((entry, observer) => {
    loadMorePosts();
  });

  const loadMorePosts = async () => {
    console.log("load?", count, Images?.length);
    if (Images?.length > 0 && count < OriginalFilteredImages?.length) {
      console.log("load?2");
      let loadNum;
      if (count + 4 > OriginalFilteredImages?.length)
        loadNum = OriginalFilteredImages?.length;
      else loadNum = count + 4;
      setCount((prev) => loadNum);
      setImages(OriginalFilteredImages.filter((v, k) => k < loadNum));
    }
  };

  useEffect(() => {
    getAccount();
    getAllMyImages();

    return () => {
      setisMounted(false);
    };
  }, [getAllMyImages, getAccount]);

  const noItems = Images !== null && !Loading && Images?.length === 0 && (
    <div className={styles.empty}>
      <SearchOffIcon className={styles.icon} /> No Items.
    </div>
  );
  const [SelectedCategory, setSelectedCategory] = useState(0);
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    const filteredImages = OriginalImages.filter(
      (value) =>
        e.target.value === 0 ||
        (e.target.value === 1 && value.type === "auction" && value.onMarket) ||
        (e.target.value === 2 && value.type === "sale" && value.onMarket) ||
        (e.target.value === 3 && !value.onMarket)
    );
    setOriginalFilterdImages(filteredImages);
    setImages(filteredImages.filter((k, v) => v <= count));
  };

  return (
    <div className={styles.box}>
      {Loading && <LoadingSpinner />}
      {/* {Images !== null && !Loading && Images?.length === 0 && (
        <div className={styles.empty}>
          <SearchOffIcon className={styles.icon} /> No Items.
        </div>
      )} */}
      <Grid container columns={24} spacing={4} padding={3}>
        {!Loading && (
          <Grid item xs={24}>
            <FormControl className={styles["header-select-category"]}>
              <InputLabel id="categories-select-label">Status</InputLabel>
              <Select
                labelId="categories-select-label"
                id="categories-select"
                onChange={handleCategoryChange}
                size="small"
                label="Category"
                value={SelectedCategory}
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>Auction</MenuItem>
                <MenuItem value={2}>Sale</MenuItem>
                <MenuItem value={3}>보유</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {!Loading &&
          Images?.length > 0 &&
          Images.map((value, index) => (
            <Grid item xs={24} sm={12} md={8} lg={6} key={value.id}>
              <Link
                to={{
                  pathname: `/myimages/${value.id}`,
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
                      Token ID
                      <span className="token-data">{value?.tokenId}</span>
                    </div>
                    <div className="token-box-info token-id">
                      Status
                      <span className="token-data">
                        {value?.onMarket ? "판매" : "보유"}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </Grid>
          ))}

        <div
          ref={setRef}
          className="Target-Element"
          style={{
            width: "100vw",
            height: "140px",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        ></div>
      </Grid>
      {noItems}
    </div>
  );
};

export default MyImage;
