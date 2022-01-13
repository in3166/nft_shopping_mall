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
  Radio,
  RadioGroup,
  Slider,
  TextareaAutosize,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./MyImageDetail.module.css";
import { useSelector } from "react-redux";
import useInput from "../../../../hooks/useInputreduce";

const MyProductInfo = (props) => {
  const { Image } = props;
  const user = useSelector((state) => state.user.user);

  const [IsAuction, setIsAuction] = useState(Image.type === "auction");
  //console.log(Image);
  //
  const [period, setPeriod] = useState(Number(Image.limit_hours));
  const [Markup, setMarkup] = useState(Number(Image?.image?.markup) || 5);

  const {
    value: startPriceValue,
    hasError: startPriceHasError,
    valueChangeHandler: startPriceChangeHandler,
    valueBlurHandler: startPriceBlurHandler,
    reset: resetStartPrice,
  } = useInput((data) => data >= 1, Image?.image?.price);
  const {
    value: buyoutValue,
    hasError: buyoutHasError,
    valueChangeHandler: buyoutChangeHandler,
    valueBlurHandler: buyoutBlurHandler,
    reset: resetBuyout,
  } = useInput((data) => data >= 1, Image?.image?.buyout);
  const {
    value: descriptionValue,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    valueBlurHandler: descriptionBlurHandler,
    reset: resetDescription,
  } = useInput((data) => data.length > 3, Image?.image?.description);

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

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("submit");
    if (!startPriceHasError && !buyoutHasError && !descriptionHasError) {
      const body = {
        price: startPriceValue,
        buyout: buyoutValue,
        period: period,
        markup: Markup,
        description: descriptionValue,
        type: IsAuction ? "auction" : "sale",
      };
    }
  };

  //

  useEffect(() => {}, []);

  if (Image.image === undefined) {
    return <>Loading...</>;
  }

  const handelTypeChange = (e) => {
    console.log(e.target.value);
    setIsAuction(e.target.value === "true");
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
        {(Image.type === "auction" || IsAuction) && (
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
              <p className={styles["error-text"]}>1 이상의 값을 입력하세요.</p>
            )}
            {!Image.onMarket && buyoutValue < startPriceValue && (
              <p className={styles["error-text"]}>
                시작 가격 이상의 값을 입력하세요.
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

        {(Image.type === "auction" || IsAuction) && (
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
            {Image.onMarket ? "판매중" : "재등록"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyProductInfo;
