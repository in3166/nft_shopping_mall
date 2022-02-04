import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  NativeSelect,
  TextField,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./Banner.module.css";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import Web3 from "web3";

import ImageContract from "../../../../abis/ImageContract.json";
import ImageSaleContract from "../../../../abis/ImageSaleContract.json";
import TokenContract from "../../../../abis/TokenContract.json";
import TokenSaleContract from "../../../../abis/TokenSaleContract.json";
import axios from "axios";
import LoadingSpinner from "../../../UI/Loading/LoadingSpinner";
const Banner = () => {
  let web3 = window.web3;
  if (!web3.eth) {
    web3 = new Web3(window.web3.currentProvider);
    window.web3 = web3;
  }
  const [Images, setImages] = useState([]);
  const [TokenPrice, setTokenPrice] = useState(0);
  const [Banners, setBanners] = useState([]);
  const [checked, setChecked] = useState([]);
  const [LoadingBanner, setLoadingBanner] = useState(false);
  const [LoadingItems, setLoadingItems] = useState(false);
  const [Categories, setCategories] = useState([]);
  const [SelectCatgoryValue, setSelectCatgoryValue] = useState(0);
  const [IsMount, setIsMount] = useState(true);

  const getAllCategories = useCallback(() => {
    axios
      .get("/api/categories/")
      .then((res) => {
        if (res.data.success && IsMount) {
          setCategories(res.data.data);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, [IsMount]);

  const getAllBanners = useCallback(() => {
    setLoadingBanner(true);
    axios
      .get("/api/banners")
      .then((res) => {
        if (res.data.success && IsMount) {
          setBanners(res.data.banners);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setLoadingBanner(false);
      });
  }, [IsMount]);

  // const getImagesFromEth = useCallback(async () => {
  //   try {
  //     setLoadingItems(true);
  //     const accounts = await web3.eth.getAccounts();
  //     const networkId = await web3.eth.net.getId();
  //     const networkData = ImageContract.networks[networkId];
  //     const abi = ImageContract.abi;
  //     const address = networkData.address;
  //     const contract = new web3.eth.Contract(abi, address);
  //     const totalSupply = await contract.methods.totalSupply().call();

  //     const tempImages = [];
  //     for (var i = 1; i <= totalSupply; i++) {
  //       const id = await contract.methods.images(i - 1).call();
  //       const owner = await contract.methods.ownerOf(i - 1).call();
  //       const metadata = await contract.methods.imageData(i - 1).call();
  //       const body = {
  //         id,
  //         owner,
  //         name: metadata.name,
  //         price: metadata.price,
  //         token: metadata.token,
  //         url: metadata.url,
  //         key: i - 1,
  //       };
  //       tempImages.push(body);
  //     }
  //     if (IsMount) setImages(tempImages);

  //     const sale_networkData = TokenSaleContract.networks[networkId];
  //     const tokenSaleAbi = TokenSaleContract.abi;
  //     const saleAddress = sale_networkData.address;
  //     const token_sale_contract = new web3.eth.Contract(
  //       tokenSaleAbi,
  //       saleAddress
  //     );

  //     let token_price = await token_sale_contract.methods.tokenPrice().call();
  //     token_price = web3.utils.fromWei(token_price, "ether");
  //     setTokenPrice(token_price);
  //   } catch (error) {
  //     alert(error);
  //   } finally {
  //     if (IsMount) setLoadingItems(false);
  //   }
  // }, [web3.eth, web3.utils, IsMount]);

  const getImagesFromDB = useCallback(() => {
    setLoadingItems(true);
    setIsMount(true);
    axios
      .get("/api/marketplaces")
      .then(async (res) => {
        if (res.data.success) {
          console.log(res.data.images);
          if (IsMount) setImages(res.data.images);
        } else {
          alert(res.data.messages);
        }

        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const networkData = ImageContract.networks[networkId];
        const abi = ImageContract.abi;
        //const address = IP.CONTRACT_ADDRESS;
        const sale_networkData = TokenSaleContract.networks[networkId];
        const tokenSaleAbi = TokenSaleContract.abi;
        const saleAddress = sale_networkData.address;
        const token_sale_contract = new web3.eth.Contract(
          tokenSaleAbi,
          saleAddress
        );

        let token_price = await token_sale_contract.methods.tokenPrice().call();
        token_price = web3.utils.fromWei(token_price, "ether");

        if (IsMount) setLoadingItems(false);
        setTokenPrice(token_price);
      })
      .catch((err) => {
        alert(err);
      });
  }, [IsMount, web3.eth, web3.utils]);

  useEffect(() => {
    //getImagesFromEth();
    getAllBanners();
    getAllCategories();
    getImagesFromDB();
    return () => {
      setIsMount(false);
    };
  }, [getImagesFromDB, getAllCategories, getAllBanners]);

  const handleCheck = (value) => {
    console.log("check value", value);
    const currentIndex = checked.findIndex((i) => i.id === value.id);
    console.log("check currentIndex", currentIndex);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAddBanners = () => {
    if (checked.length < 1) {
      alert("하나 이상 선택하세요.");
      return;
    } else if (checked.length + Banners.length > 7) {
      alert("7개 이하의 배너만 추가할 수 있습니다.");
      return;
    }

    axios
      .post("/api/banners/", checked)
      .then((res) => {
        if (res.data.success) {
          alert("배너 추가 성공");
          getAllBanners();
        } else {
          alert(res.data.message);
        }
        setChecked([]);
      })
      .catch((err) => {
        console.log(err.response.data.message.detail);
        alert(err.response.data.message.detail);
      });
  };

  const handleRemoveBanner = (value) => {
    console.log(value);
    axios
      .delete("/api/banners", { data: value })
      .then((res) => {
        console.log(res.data);
        getAllBanners();
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleSelectCategoryChange = (e) => {
    console.log(e.target.value);
    setSelectCatgoryValue(e.target.value);
  };

  const [SearchText, setSearchText] = useState("");
  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  // const handlerSearchSubmit = () => {
  //   setSearchOn(true)
  // };

  return (
    <>
      <Container sx={{ overflow: "hidden", display: "grid" }}>
        <h4>Banner</h4>
        <List
          sx={{
            flexDirection: "row",
            display: "flex",
            overflow: "scroll",
            marginBottom: "15px",
            padding: "0.5rem",
            border: "1px solid gainsboro",
          }}
        >
          {LoadingBanner && Banners.length === 0 && (
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
          {!LoadingBanner && Banners.length < 1 ? (
            <div style={{ width: "100%", textAlign: "center", margin: "30px" }}>
              <h5>No Banners.</h5>
            </div>
          ) : (
            Banners.map((value, index) => (
              <ListItem className={styles.bannerItem} key={value.id}>
                <Card
                  sx={{
                    maxWidth: 200,
                    maxHeight: 250,
                    width: 150,
                    height: 190,
                    position: "relative",
                  }}
                >
                  <CardHeader
                    action={
                      <IconButton
                        aria-label="settings"
                        size="small"
                        onClick={() => handleRemoveBanner(value)}
                      >
                        <CloseIcon />
                      </IconButton>
                    }
                    // titleTypographyProps={{
                    //   variant: "subtitle1",
                    // }}
                    // subHeader="Shrimp"
                    title={
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="div"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={value.name}
                      >
                        {value.name}
                      </Typography>
                    }
                    sx={{ padding: "7px" }}
                  />
                  {/* <Checkbox className={styles.checkbox} disableRipple /> */}
                  <img
                    src={value.url}
                    alt="temp"
                    style={{
                      display: "block",
                      WebkitBackgroundSize: "cover",
                      backgroundSize: "cover",
                      WebkitMaskPosition: "no-repeat",
                      backgroundPosition: "center",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Card>
              </ListItem>
            ))
          )}
        </List>
        <br />
        <h5 style={{ float: "left" }}>Select IMAGES</h5>
        <Box
          sx={{ border: "1px solid gainsboro", overflow: "hidden" }}
          padding={3}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "26px",
            }}
          >
            <div>
              <Button variant="outlined" onClick={handleAddBanners}>
                <AddIcon />
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-around",
              }}
            >
              <FormControl sx={{ marginRight: "10px" }}>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Category
                </InputLabel>
                <NativeSelect
                  value={SelectCatgoryValue}
                  onChange={handleSelectCategoryChange}
                  inputProps={{
                    name: "category",
                    id: "uncontrolled-native",
                  }}
                >
                  <option value={0}>All</option>
                  {Categories.map((value) => (
                    <option value={value.id} key={value.id}>
                      {value.name}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>

              <FormControl fullWidth variant="standard">
                <TextField
                  variant="standard"
                  onChange={handleSearchTextChange}
                  value={SearchText}
                  placeholder="Search"
                  inputProps={{
                    name: "Search",
                    id: "uncontrolled-search",
                  }}
                />
              </FormControl>
              {/* <Button variant="outlined" onClick={handlerSearchSubmit}>
                검색
              </Button> */}
            </div>
          </div>

          <Grid container columns={18} spacing={2}>
            {LoadingItems && Images.length === 0 && (
              <Grid item xs={18}>
                <LoadingSpinner />
              </Grid>
            )}
            {Images.filter(
              (v) =>
                (Number(v.categoryId) === Number(SelectCatgoryValue) ||
                  Number(SelectCatgoryValue) === 0) &&
                (v.name.includes(SearchText) ||
                  v.ownerEmail.includes(SearchText))
            ).length === 0 && (
              <div
                style={{ width: "100%", textAlign: "center", margin: "50px" }}
              >
                <h5>No Items.</h5>
              </div>
            )}
            {!LoadingItems &&
              Images.filter(
                (v) =>
                  (Number(v.categoryId) === Number(SelectCatgoryValue) ||
                    Number(SelectCatgoryValue) === 0) &&
                  (v.name.includes(SearchText) ||
                    v.ownerEmail.includes(SearchText))
              ).map((value, index) => {
                return (
                  <Grid item xs={18} sm={9} md={6} lg={4.5} key={value.id}>
                    <Card title={value.name}>
                      <CardActionArea>
                        <Checkbox
                          checked={
                            checked.findIndex((i) => i.id === value.id) !== -1
                          }
                          tabIndex={-1}
                          className={styles.checkbox}
                          disableRipple
                          onClick={() => handleCheck(value)}
                        />
                        <CardMedia
                          component="img"
                          height="140"
                          src={value.url}
                          //image="http://via.placeholder.com/640x360"
                          alt={"images" + index}
                        />
                        <CardContent>
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            sx={{
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {value.name}
                          </Typography>
                          <Typography
                            component="div"
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              display: "block",
                              lineHeight: "1.39",
                              wordWrap: "break-word",
                            }}
                          >
                            {/* <p>
                              <strong>Name</strong> {value.name}
                            </p> */}
                            <p>
                              <strong>Owner</strong> {value.ownerEmail}
                            </p>
                            <p>
                              <strong>Price</strong>{" "}
                              {value.current_price * TokenPrice}
                              ETH
                            </p>
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      {/* <CardActions>
                        <Button size="small" color="primary">
                          Share
                        </Button>
                      </CardActions> */}
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Banner;
