import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import axios from "axios";
import { CircularProgress, Stack } from "@mui/material";

import { useScroll } from "../../hooks/useScroll";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import ViewCounts from "../../util/ViewCounts";
import HomeBanner from "./Sections/HomeBanner";
import ProductList from "./Sections/ProductList";
import "./HomePage.css";

const HomePage = (props) => {
  const { t } = useTranslation();
  const [Images, setImages] = useState([]);
  const [TokenPrice, setTokenPrice] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [IsMount, setIsMount] = useState(true);

  const [count, setCount] = useState(6);
  const [ref, setRef] = useInfiniteScroll((entry, observer) => {
    loadMorePosts();
  });
  const loadMorePosts = async () => {
    let loadNum;
    if (Images?.length && Images?.length > 0) {
      if (count + 4 > Images?.length) loadNum = Images?.length;
      else loadNum = count + 4;
      if (IsMount) setCount((prev) => loadNum);
    }
  };

  const user = useSelector((state) => state.user.user);
  
  const getAllImages = useCallback(async () => {
    setLoading(true);
    setIsMount(true);
    const imagesRes = await axios.get("/api/marketplaces/", {
      headers: { email: user.email },
    });

    // 조회수 등록
    ViewCounts(window.location.pathname, user.email);

    // nav bar 검색 시
    imagesRes.data.images = imagesRes.data.images.sort((a, b) => {
      return (
        new Date(a.starting_time).getTime() +
        a.limit_hours * 60 * 60 * 1000 -
        (new Date(b.starting_time).getTime() + b.limit_hours * 60 * 60 * 1000)
      );
    });

    console.log(imagesRes.data.images);
    if (IsMount) {
      setImages(imagesRes.data.images);
      setLoading(false);
    }
  }, [user.email, IsMount]);

  const [Banners, setBanners] = useState([]);
  const getAllBanners = useCallback(() => {
    axios
      .get("/api/banners")
      .then((res) => {
        console.log("배너 가져오기: ", res.data.banners);
        if (res.data.success && IsMount) {
          setBanners(res.data.banners);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, [IsMount]);

  useEffect(() => {
    getAllImages();
    getAllBanners();
    return () => {
      setIsMount(false);
    };
  }, [getAllImages, getAllBanners]);

  return (
    <div className="contents2">
      {Banners.length > 0 && (
        <HomeBanner Banners={Banners} Images={Images} TokenPrice={TokenPrice} />
      )}

      <div className="card page-head">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            {t("home.title")}
          </h5>
        </div>
      </div>

      <div className="product-page flex-wrap w-100">
        {Loading && (
          <Stack
            sx={{
              color: "grey.500",
              width: "100%",
              minHeight: "250px",
              justifyContent: "center",
              alignItems: "center",
            }}
            spacing={2}
            direction="row"
          >
            <CircularProgress color="inherit" />
          </Stack>
        )}
        {!Loading && IsMount && (
          <ProductList
            // _DATA={_DATA}
            Images={Images}
            TokenPrice={TokenPrice}
            count={count}
            user={user}
            Loading={Loading}
            IsMount={IsMount}
            setIsMount={setIsMount}
          />
        )}
      </div>

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
    </div>
  );
};

export default HomePage;
