import {
  Container,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Slider,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

import styles from "../UserUpload.module.css";
import useInput from "../../../hooks/useInputreduce";

const UploadAuction = (props) => {
  const { user } = props;
  const [period, setPeriod] = useState(12);
  const [Markup, setMarkup] = useState(5);
  const [file, setfile] = useState("");

  const {
    value: urlValue,
    hasError: urlHasError,
    valueChangeHandler: urlChangeHandler,
    valueBlurHandler: urlBlurHandler,
    reset: resetUrl,
  } = useInput((data) => data.length > 3);

  const {
    value: startPriceValue,
    hasError: startPriceHasError,
    valueChangeHandler: startPriceChangeHandler,
    valueBlurHandler: startPriceBlurHandler,
    reset: resetStartPrice,
  } = useInput((data) => data >= 1);
  const {
    value: buyoutValue,
    hasError: buyoutHasError,
    valueChangeHandler: buyoutChangeHandler,
    valueBlurHandler: buyoutBlurHandler,
    reset: resetBuyout,
  } = useInput((data) => data >= 1);
  const {
    value: descriptionValue,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    valueBlurHandler: descriptionBlurHandler,
    reset: resetDescription,
  } = useInput((data) => data.length > 3);

  const handlePeriodSliderChange = (event, newValue) => {
    setPeriod(newValue);
  };

  const handlePeriodInputChange = (event) => {
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
    setMarkup(newValue);
  };

  const handleMarkupInputChange = (event) => {
    setMarkup(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleMarkupBlur = () => {
    if (Markup < 5) {
      setMarkup(5);
    } else if (Markup > 20) {
      setMarkup(20);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (
      !urlHasError &&
      !startPriceHasError &&
      !buyoutHasError &&
      !descriptionHasError &&
      file.filename !== ""
    ) {
      const formData = new FormData();
      formData.append(
        "body",
        JSON.stringify({
          email: user.email,
          url: urlValue,
          startPrice: startPriceValue,
          buyout: buyoutValue,
          period: period,
          markup: Markup,
          description: descriptionValue,
        })
      );
      formData.append("file", file);
      console.log(formData);

      axios
        .post("/api/files/", formData, {
          header: { "content-type": "multipart/form-data" },
        })
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            alert(res.data.msg);
          } else {
            alert(res.data.msg);
          }
          resetUrl();
          resetBuyout();
          resetDescription();
          resetStartPrice();
          setPeriod(12);
          setMarkup(5);
          setfile({ filename: "" });
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      alert("입력을 완료해주세요.");
    }
  };

  return (
    <Container className={styles.container}>
      <form className="row text-end" onSubmit={submitHandler}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <span className={styles["form-input-name"]}>이미지</span>
            <input
              type="file"
              required
              name="file"
              className="form-control my-2"
              placeholder="Choose Image"
              onChange={(event) => {
                // setfile({ new_image: event.target.files[0] })
                setfile(event.target.files[0]);
              }}
              value={file?.filename}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <span className={styles["form-input-name"]}>URL</span>
            <input
              type="text"
              required
              className="form-control my-2"
              placeholder="Name"
              onBlur={urlBlurHandler}
              onChange={urlChangeHandler}
              value={urlValue}
            />
            {urlHasError && (
              <p className={styles["error-text"]}>URL을 4자 이상 입력하세요.</p>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <span className={styles["form-input-name"]}>시작가</span>
            <input
              type="number"
              required
              className="form-control my-2"
              placeholder="Price in Ebizon Tokens"
              onBlur={startPriceBlurHandler}
              onChange={startPriceChangeHandler}
              value={startPriceValue}
            />
            {startPriceHasError && (
              <p className={styles["error-text"]}>1 이상의 값을 입력하세요.</p>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <span className={styles["form-input-name"]}>BuyOut</span>
            <input
              type="number"
              required
              className="form-control my-2"
              placeholder="Price in Ebizon Tokens"
              onBlur={buyoutBlurHandler}
              onChange={buyoutChangeHandler}
              value={buyoutValue}
            />
            {buyoutHasError && (
              <p className={styles["error-text"]}>1 이상의 값을 입력하세요.</p>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <span className={styles["form-input-name"]}>경매 기간</span>
            <Grid container spacing={1} margin="0px 1px 1px 1px">
              <Grid item xs={8}>
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
              <Grid item xs={4} textAlign="center">
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
                    aria-describedby="component-helper-text"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <span className={styles["form-input-name"]}>Markup</span>
            <Grid container spacing={1} margin="0px 1px 1px 1px">
              <Grid item xs={8}>
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
              <Grid item xs={4} textAlign="center">
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
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <span className={styles["form-input-name"]}>Description</span>
            <textarea
              type="text"
              required
              className="form-control my-2"
              placeholder="Description"
              rows="3"
              onBlur={descriptionBlurHandler}
              onChange={descriptionChangeHandler}
              value={descriptionValue}
            />
            {descriptionHasError && (
              <p className={styles["error-text"]}>
                Description을 4자 이상 입력하세요.
              </p>
            )}
          </Grid>
          <Grid item xs={12}>
            <input
              type="submit"
              className="btn btn-block btn-primary my-3 rounded-0"
              value="Create Image NFT"
            />
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default UploadAuction;
