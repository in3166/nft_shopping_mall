import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import { useTranslation } from "react-i18next";
import ImageContract from "../../../abis/ImageContract.json";
import TokenSaleContract from "../../../abis/TokenSaleContract.json";
import { Card, CircularProgress, Pagination, Stack } from "@mui/material";
import usePagination from "../../../hooks/usePagination";
import axios from "axios";
import HomeBanner from "./Sections/HomeBanner";
import ProductList from "./Sections/ProductList";
import { useScroll } from "../../../hooks/useScroll";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";

const HomePage = (props) => {
  const { t } = useTranslation();
  const [Images, setImages] = useState([]);
  const [TokenPrice, setTokenPrice] = useState(0);
  const [Loading, setLoading] = useState(false);

  const { scrollY } = useScroll();

  const PER_PAGE = 8;
  //const _DATA = usePagination(Images, PER_PAGE);
  const [page, setPage] = useState(1);

  // const handlePageChange = (e, page) => {
  //   setPage(page);
  //   _DATA?.jump(page);
  // };

  const [count, setCount] = useState(5);
  // const [ref, setRef] = useInfiniteScroll((entry, observer) => {
  //   loadMorePosts();
  // });

  function loadMorePosts() {
    setCount((v) => {
      if (v + 5 <= Images.length) return v + 5;
      else return Images.length;
    });
  }
  console.log(count, "count");

  console.log(
    scrollY,
    window.innerHeight,
    scrollY + window.innerHeight,
    document.body.scrollHeight
  );

  if (
    Images.length > 0 &&
    !Loading &&
    count < Images.length
    //Math.ceil(Images.length / PER_PAGE) > page
  ) {
    console.log("!!");
    if (scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
      console.log("@@");
      loadMorePosts();
      // setPage(page + 1);
      //handlePageChange(null, page + 1);
    }
  }

  const getAllImages = async () => {
    setLoading(true);
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const networkData = ImageContract.networks[networkId];

    if (networkData) {
      const abi = ImageContract.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      const totalSupply = await contract.methods.totalSupply().call();

      let temp = [];

      console.log("imagesss:? : ", await contract.methods.images(3).call());
      console.log("imagesss:? : ", await contract.methods.imageData(3).call());
      console.log("imagesss:? : ", await contract.methods.ownerOf(3).call());
      // Load NFTs
      for (var i = 1; i <= totalSupply; i++) {
        const id = await contract.methods.images(i - 1).call();
        const owner = await contract.methods.ownerOf(i - 1).call();
        const metadata = await contract.methods.imageData(i - 1).call();
        temp = [
          ...temp,
          {
            id,
            owner,
            name: metadata.name,
            price: metadata.price,
            token: metadata.token,
            url: metadata.url,
          },
        ];
      }
      setImages(temp);
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }

    const sale_networkData = TokenSaleContract.networks[networkId];
    if (sale_networkData) {
      const abi = TokenSaleContract.abi;
      const address = sale_networkData.address;
      const token_sale_contract = new web3.eth.Contract(abi, address);
      if (token_sale_contract) {
        var token_price = await token_sale_contract.methods.tokenPrice().call();
        setTokenPrice(web3.utils.fromWei(token_price, "ether"));
      }
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }
    setLoading(false);
  };

  const [Banners, setBanners] = useState([]);
  const getAllBanners = () => {
    axios
      .get("/api/banners")
      .then((res) => {
        console.log("배너 가져오기: ", res.data.banners);
        if (res.data.success) {
          setBanners(res.data.banners);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    getAllImages();
    getAllBanners();
  }, []);

  return (
    <div className="contents2">
      {/* 2021.11.26 main img slide 추가 */}
      <HomeBanner Banners={Banners} Images={Images} TokenPrice={TokenPrice} />
      {/* 2021.11.26 main img slide 끝 */}

      <div className="card page-head">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            {t("home.title")}
            {/* 20211108 주석 처리 {totalTokensMinted} */}
          </h5>
        </div>
      </div>

      {/* <div className="align-items-left d-flex justify-content-left w-100 p-5">
        <div className="align-items-left d-flex justify-content-left">
          <select>
            <option>1</option>
            <option>2</option>
          </select>
          <input type="text" />
          <button>검색</button>
        </div>
      </div> */}

      <div className="product-page flex-wrap w-100 p-5">
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
            //className={styles.loading}
          >
            <CircularProgress color="inherit" />
          </Stack>
        )}
        {!Loading && (
          <ProductList
           // _DATA={_DATA}
            Images={Images}
            TokenPrice={TokenPrice}
            count={count}
          />
        )}
      </div>

      {/* 21.11.26 페이지 넘기는 부분 */}
      {/* {!Loading && (
        <div className="market-pager d-flex">
          <Pagination
            //count={10}
            ref={setRef}
            color="primary"
            page={page}
            siblingCount={1}
            boundaryCount={1}
            count={Math.ceil(Images.length / PER_PAGE)}
            onChange={handlePageChange}
          />
        </div>
      )} */}
    </div>
  );
};

export default HomePage;
