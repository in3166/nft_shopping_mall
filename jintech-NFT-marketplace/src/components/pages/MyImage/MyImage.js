import { Card, Grid } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import styles from "./MyImage.module.css";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import LoadingSpinner from "../../UI/Loading/LoadingSpinner";

const MyImage = (props) => {
  const { authChecked } = props;
  const history = useHistory();
  const user = useSelector((state) => state.user.user);
  const [Images, setImages] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [isMounted, setisMounted] = useState(true);

  console.log(Images);
  const getAllMyImages = useCallback(() => {
    setLoading(true);
    axios
      .get("/api/marketplaces/myimages/" + user.email)
      .then((res) => {
        if (res.data.success) {
          setImages(res.data.images);
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
      await axios
        .get(`/api/users/user/${user.email}`)
        .then((res) => {
          console.log("res : ", res.data.address);
          if (accounts[0] !== res.data.address) {
            if (user.isLoggedIn && authChecked) {
              alert("지갑 주소가 맞지 않습니다.");
              history.replace("/");
            }
            //user.walletAddress = accounts[0];
          }
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    }
    if (isMounted) setLoading(false);
  }, [history, user, authChecked, isMounted]);

  useEffect(() => {
    getAccount();
    getAllMyImages();

    return () => {
      setisMounted(false);
    };
  }, [getAllMyImages, getAccount, isMounted]);

  const noItems = Images !== null && !Loading && Images?.length === 0 && (
    <div className={styles.empty}>
      <SearchOffIcon className={styles.icon} /> No Items.
    </div>
  );

  return (
    <div className={styles.box}>
      {Loading && <LoadingSpinner />}
      {/* {Images !== null && !Loading && Images?.length === 0 && (
        <div className={styles.empty}>
          <SearchOffIcon className={styles.icon} /> No Items.
        </div>
      )} */}
      <Grid container columns={24} spacing={4} padding={3}>
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
      </Grid>
      {noItems}
    </div>
  );
};

export default MyImage;