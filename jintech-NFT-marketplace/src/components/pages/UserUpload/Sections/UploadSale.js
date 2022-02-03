import {
  Container,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Slider,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import useInput from "../../../../hooks/useInputreduce";

import Crypto from "crypto";
/* 2021-11-19 ipfs 를 위한 취가 */
import { create } from "ipfs-http-client";

import styles from "../UserUpload.module.css";
import getBase64 from "../../../../util/getBase64";

const UploadSale = (props) => {
  const { networkId, totalSupply, address, contract, accounts } = props;
  const [period, setPeriod] = useState(12);
  const [file, setfile] = useState("");
  const user = useSelector((state) => state.user.user);

  const {
    value: nameValue,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    valueBlurHandler: nameBlurHandler,
    inputRef: nameRef,
    valueIsValid: nameIsValid,
    reset: resetUrl,
  } = useInput((data) => data.length > 3);

  const {
    value: startPriceValue,
    hasError: startPriceHasError,
    valueIsValid: priceIsValid,
    valueChangeHandler: startPriceChangeHandler,
    valueBlurHandler: startPriceBlurHandler,
    inputRef: priceRef,
    reset: resetStartPrice,
  } = useInput((data) => data >= 1);

  const {
    value: descriptionValue,
    hasError: descriptionHasError,
    inputRef: descriptionRef,
    valueIsValid: descriptionIsValid,
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (file === "" || !file.name) {
      alert("file is empty.");
      return;
    } else if (!nameIsValid || !priceIsValid || !descriptionIsValid) {
      alert("입력을 완료해주세요.");
      return;
    }

    var client = create("http://127.0.0.1:5002/");
    const { cid } = await client.add(file);
    console.log("cid: ", cid);
    //const urlStr = `http://jtsol.iptime.org:8080/ipfs/${cid}`;
    //const urlStr = `http://ipfs.infura.io/ipfs/${cid}`;
    const urlStr = `http://localhost:9090/ipfs/${cid}`;

    const body = {
      ownerEmail: user.email,
      url: urlStr,
      current_price: startPriceValue,
      limit_hours: period,
      description: descriptionValue,
      type: "sale",
      onMarket: false,
      soldOut: false,
      networkId: networkId,
      tokenId: totalSupply - 1,
      starting_time: new Date(),
      contractAddress: address,
      name: nameValue,
    };

    axios
      .post("/api/marketplaces", body)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          getBase64(file, (result) => {
            const baseFile = result;
            const hash = Crypto.createHash("sha256")
              .update(baseFile)
              .digest("base64");
            const tokenURI = "https://token.artblocks.io/3784";

            contract.methods
              .mint(
                nameValue, //name
                descriptionValue,
                urlStr,
                startPriceValue,
                hash
              )
              .send({ from: accounts })
              .once("receipt", (receipt) => {
                console.log("nft created");
                alert(res.data.message);
                resetUrl();
                resetDescription();
                resetStartPrice();
                setPeriod(12);
                setfile("");
              })
              .catch(async (err) => {
                console.log(err);
                alert(err.message);
                // db삭제 ...
                const deleteDB = await axios.delete(
                  "/api/marketplaces/" + res.data.id
                );
                console.log("deleteDB: ", deleteDB);
                if (deleteDB.data.success) {
                  console.log(deleteDB.data.message);
                }
              });
          });
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });

    // const formData = new FormData();
    // formData.append(
    //   "body",
    //   JSON.stringify({
    //     email: user.email,
    //     url: urlStr,
    //     price: startPriceValue,
    //     buyout: startPriceValue,
    //     period: period,
    //     description: descriptionValue,
    //     type: "sale",
    //     address: user.userAddress
    //   })
    // );
    // formData.append("file", file);
    // axios
    //   .post("/api/images/", formData, {
    //     header: { "content-type": "multipart/form-data" },
    //   })
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
              key={file?.filename}
              onChange={(event) => {
                // setfile({ new_image: event.target.files[0] })
                setfile(event.target.files[0]);
              }}
              value={file?.filename}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <span className={styles["form-input-name"]}>Name</span>
            <input
              type="text"
              required
              className="form-control my-2"
              placeholder="Name"
              onBlur={nameBlurHandler}
              onChange={nameChangeHandler}
              value={nameValue}
              ref={nameRef}
            />
            {nameHasError && (
              <p className={styles["error-text"]}>
                Name을 4자 이상 입력하세요.
              </p>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <span className={styles["form-input-name"]}>판매가</span>
            <input
              type="number"
              required
              className="form-control my-2"
              placeholder="Price in Ebizon Tokens"
              onBlur={startPriceBlurHandler}
              onChange={startPriceChangeHandler}
              ref={priceRef}
              value={startPriceValue}
            />
            {startPriceHasError && (
              <p className={styles["error-text"]}>1 이상의 값을 입력하세요.</p>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <span className={styles["form-input-name"]}>판매 기간</span>
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
          <Grid item xs={12}>
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
              ref={descriptionRef}
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

export default UploadSale;
