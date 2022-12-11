import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import axios from "axios";
import { Box, Card, Grid } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import "../HomePage.css";
import styles from "./ProductList.module.css";

const ProductList = (props) => {
  const { count, Images, TokenPrice, user, Loading } = props;

  const [IsMount, setIsMount] = useState(true);
  const [Likes, setLikes] = useState([]);

  const getAllLikes = useCallback(() => {
    if (user.email && user.email !== "")
      axios
        .get("/api/favorites/" + user.email)
        .then((res) => {
          console.log("likes: ", res.data);
          if (IsMount) setLikes(res.data);
        })
        .catch((err) => {
          alert(err);
        });
  }, [user.email, IsMount]);

  useEffect(() => {
    getAllLikes();
    return () => {
      setIsMount(false);
    };
  }, [getAllLikes, setIsMount]);

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
            if (res.data.status && IsMount) {
              setLikes((prev) => [...prev, body]);
            } else {
              if (IsMount)
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
    <Box className={styles.box}>
      {Loading && <LoadingSpinner />}

      {!Loading && Images?.length === 0 && (
        <div className={styles.empty}>
          <SearchOffIcon className={styles.icon} /> No Items.
        </div>
      )}

      <Grid container columns={24} spacing={4} padding={3}>
        {!Loading &&
          Images.filter((v, k) => k < count).map((value, index) => (
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
    </Box>
  );
};

export default ProductList;
