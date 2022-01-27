import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Slider,
  TextareaAutosize,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./MyImageDetail.module.css";
import { useSelector } from "react-redux";
import useInput from "../../../../hooks/useInputreduce";

const MyProductInfo = (props) => {
  const { Image, Categories } = props;
  const user = useSelector((state) => state.user.user);

  const [IsAuction, setIsAuction] = useState(Image.type === "auction");
  //console.log(Image);
  //
  const [period, setPeriod] = useState(Number(Image.limit_hours));
  const [Markup, setMarkup] = useState(Number(Image?.markup) || 5);
  const [categoryId, setcategoryId] = useState(
    Image.categoryId !== null ? Image.categoryId : 0
  );

  const {
    value: startPriceValue,
    hasError: startPriceHasError,
    valueChangeHandler: startPriceChangeHandler,
    valueBlurHandler: startPriceBlurHandler,
    valueIsValid: startPriceIsValid,
    reset: resetStartPrice,
  } = useInput((data) => data >= 1, Image?.current_price);
  const {
    value: buyoutValue,
    hasError: buyoutHasError,
    valueChangeHandler: buyoutChangeHandler,
    valueBlurHandler: buyoutBlurHandler,
    valueIsValid: buyoutIsValid,
    reset: resetBuyout,
  } = useInput((data) => data > Image?.current_price, Image?.buyout + 1);
  const {
    value: descriptionValue,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    valueBlurHandler: descriptionBlurHandler,
    valueIsValid: descriptionIsValid,
    reset: resetDescription,
  } = useInput((data) => data.length > 3, Image?.description);

  const handlePeriodSliderChange = (event, newValue) => {
    if (Image.onMarket) return;
    setPeriod(newValue);
  };

  const handlePeriodInputChange = (event) => {
    if (Image.onMarket) return;
    setPeriod(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handlePeriodBlur = () => {
    if (period < 12) {
      setPeriod(12);
    } else if (period > 168) {
      setPeriod(168);
    }
  };

  const handleMarkupSliderChange = (event, newValue) => {
    if (Image.onMarket) return;
    setMarkup(newValue);
  };

  const handleMarkupInputChange = (event) => {
    if (Image.onMarket) return;
    setMarkup(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleMarkupBlur = () => {
    if (Markup < 5) {
      setMarkup(5);
    } else if (Markup > 20) {
      setMarkup(20);
    }
  };

  console.log(Image);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("submit");

    if (startPriceIsValid && buyoutIsValid && descriptionIsValid) {
      const body = {
        email: user.email,
        id: Image.id,
        type: IsAuction ? "auction" : "sale",
        starting_time: new Date(),
        limit_hours: period,
        current_price: startPriceValue,
        imageId: Image.product,
        buyout: buyoutValue,
        markup: Markup,
        description: descriptionValue,
        categoryId: categoryId,
      };
      console.log(body);

      axios
        .put("/api/marketplaces", body)
        .then((res) => {
          if (res.data.success) {
            alert("등록 성공");
          } else {
            alert(res.data.message);
          }
          window.location.reload();
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      console.log(buyoutIsValid);
      alert("입력 값 오류");
    }
  };

  //

  useEffect(() => {}, []);

  if (Image.id === undefined) {
    return <>Loading...</>;
  }

  const handelTypeChange = (e) => {
    console.log(e.target.value);
    setIsAuction(e.target.value === "true");
  };

  const handleCategoryChange = (e) => {
    setcategoryId(e.target.value);
  };
  return (
    <Box sx={{ mt: 1, pr: 2 }}>
      <h5>Details</h5>

      <Grid container columns={18} spacing={2} sx={{ mt: 2, mb: 2 }}>
        {!Image.onMarket && (
          <Grid item xs={18} md={18}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup
                row
                aria-label="type"
                name="row-radio-buttons-group"
                value={IsAuction}
                // defaultValue={IsAuction}
                onChange={handelTypeChange}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Auction"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Sale"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={18} md={18}>
          <span className={styles["form-input-name"]}>Category</span>
          <FormControl fullWidth variant="standard">
            <InputLabel id="demo-simple-select-standard-label"></InputLabel>
            <Select
              readOnly={Image.onMarket}
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={categoryId}
              onChange={handleCategoryChange}
              displayEmpty
              size="small"
              label=""
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
        </Grid>
        <Grid item xs={18} md={18}>
          <span className={styles["form-input-name"]}>가격</span>
          <input
            type="number"
            required
            className="form-control my-2"
            placeholder="Price in Ebizon Tokens"
            onBlur={startPriceBlurHandler}
            onChange={startPriceChangeHandler}
            value={startPriceValue}
            readOnly={Image.onMarket}
          />
          {!Image.onMarket && startPriceHasError && (
            <p className={styles["error-text"]}>1 이상의 값을 입력하세요.</p>
          )}
        </Grid>
        {IsAuction && (
          <Grid item xs={18} md={18}>
            <span className={styles["form-input-name"]}>BuyOut</span>
            <input
              type="number"
              required
              className="form-control my-2"
              placeholder="Price in Ebizon Tokens"
              onBlur={buyoutBlurHandler}
              onChange={buyoutChangeHandler}
              value={buyoutValue}
              readOnly={Image.onMarket}
            />
            {!Image.onMarket && buyoutHasError && (
              <p className={styles["error-text"]}>
                시작 가격보다 높은 값을 입력하세요.
              </p>
            )}
          </Grid>
        )}

        <Grid item xs={18} md={18}>
          <span className={styles["form-input-name"]}>경매 기간</span>
          <Grid container columns={18} spacing={1} margin="0px 1px 1px 1px">
            <Grid item xs={12}>
              <Slider
                value={typeof period === "number" ? period : 12}
                onChange={handlePeriodSliderChange}
                aria-labelledby="input-slider"
                defaultValue={12}
                min={12}
                step={1}
                max={168}
                marks={[
                  {
                    value: 12,
                    label: "12h",
                  },
                  {
                    value: 168,
                    label: "168h",
                  },
                ]}
              />
            </Grid>
            <Grid item xs={6} textAlign="center">
              <FormControl variant="standard">
                <InputLabel htmlFor="period">(Hour)</InputLabel>
                <Input
                  value={period}
                  size="small"
                  id="period"
                  onChange={handlePeriodInputChange}
                  onBlur={handlePeriodBlur}
                  inputProps={{
                    step: 1,
                    min: 12,
                    max: 168,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                  readOnly={Image.onMarket}
                  aria-describedby="component-helper-text"
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {IsAuction && (
          <Grid item xs={18} md={18}>
            <span className={styles["form-input-name"]}>Markup</span>
            <Grid container columns={18} spacing={1} margin="0px 1px 1px 1px">
              <Grid item xs={12}>
                <Slider
                  value={typeof Markup === "number" ? Markup : 5}
                  onChange={handleMarkupSliderChange}
                  aria-labelledby="input-slider"
                  defaultValue={5}
                  min={5}
                  step={1}
                  max={20}
                  marks={[
                    {
                      value: 5,
                      label: "5%",
                    },
                    {
                      value: 20,
                      label: "20%",
                    },
                  ]}
                />
              </Grid>
              <Grid item xs={6} textAlign="center">
                <FormControl variant="standard">
                  <InputLabel htmlFor="markup">(%)</InputLabel>
                  <Input
                    id="markup"
                    value={Markup}
                    size="small"
                    onChange={handleMarkupInputChange}
                    onBlur={handleMarkupBlur}
                    inputProps={{
                      step: 1,
                      min: 5,
                      max: 20,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                    readOnly={Image.onMarket}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item xs={18} md={18}>
          <InputLabel>Description</InputLabel>
          <TextareaAutosize
            maxRows={5}
            minRows={3}
            placeholder="상품 설명을 입력하세요."
            value={descriptionValue}
            style={{
              width: "100%",
              padding: "7px",
              margin: "5px 0px 10px 0px",
            }}
            onBlur={descriptionBlurHandler}
            onChange={descriptionChangeHandler}
            readOnly={Image.onMarket}
          />
          {!Image.onMarket && descriptionHasError && (
            <p className={styles["error-text"]}>설명을 4자 이상 입력하세요.</p>
          )}
        </Grid>
        <Grid item xs={18}>
          <Button
            onClick={submitHandler}
            variant="contained"
            color="warning"
            fullWidth
            style={{ width: "100%" }}
            disabled={Image.onMarket}
          >
            {Image.onMarket ? "판매중" : "등록"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyProductInfo;
