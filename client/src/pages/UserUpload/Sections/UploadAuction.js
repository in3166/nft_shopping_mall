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
import { useSelector } from "react-redux";
import styles from "../UserUpload.module.css";
import useInput from "../../../hooks/useInputreduce";
import getBase64 from "../../../util/getBase64";
import Crypto from "crypto";

import { create } from "ipfs-http-client";
import IP from "../../../ipconfig.json";

const UploadAuction = (props) => {
  const { networkId, totalSupply, address, contract, accounts } = props;

  const user = useSelector((state) => state.user.user);
  const [period, setPeriod] = useState(12);
  const [Markup, setMarkup] = useState(5);
  const [file, setfile] = useState("");

  const {
    value: nameValue,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    valueBlurHandler: nameBlurHandler,
    inputRef: nameRef,
    valueIsValid: nameIsValid,
    reset: resetName,
  } = useInput((data) => data.length > 3);

  const {
    value: startPriceValue,
    hasError: startPriceHasError,
    valueChangeHandler: startPriceChangeHandler,
    inputRef: priceRef,
    valueIsValid: priceIsValid,
    valueBlurHandler: startPriceBlurHandler,
    reset: resetStartPrice,
  } = useInput((data) => data >= 1);
  const {
    value: buyoutValue,
    hasError: buyoutHasError,
    valueIsValid: buyoutIsValid,
    inputRef: buyoutRef,
    valueChangeHandler: buyoutChangeHandler,
    valueBlurHandler: buyoutBlurHandler,
    reset: resetBuyout,
  } = useInput((data) => data >= 1);
  const {
    value: descriptionValue,
    valueIsValid: descriptionIsValid,
    hasError: descriptionHasError,
    inputRef: descriptionRef,
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

  const submitHandler = async (e) => {
    e.preventDefault();

    if (file === "" || !file.name) {
      alert("file is empty.");
      return;
    } else if (
      !nameIsValid ||
      !priceIsValid ||
      !buyoutIsValid ||
      !descriptionIsValid
    ) {
      alert("입력을 완료해주세요.");
      return;
    }

    // ipfs client 생성 및 이미지 추가
    // IPFS_CREATE_CLIENT_URL
    var client = create(IP.IPFS_CREATE_CLIENT_URL);
    const { cid } = await client.add(file);
    console.log("cid: ", cid);

    //const urlStr = `http://jtsol.iptime.org:8080/ipfs/${cid}`;
    //const urlStr = `http://ipfs.infura.io/ipfs/${cid}`;

    // ipfs에 업로드된 이미지 주소
    // IPFS_SAVE_URL
    const urlStr = `${IP.IPFS_SAVE_URL}/${cid}`;

    // 서버에 이미지를 직접 저장하기 위한 코드 => ipfs로 수정 추후 사용 가능
    // const formData = new FormData();
    // formData.append(
    //   "body",
    //   JSON.stringify({
    //     email: user.email,
    //     url: urlStr,
    //     price: startPriceValue,
    //     buyout: buyoutValue,
    //     period: period,
    //     markup: Markup,
    //     description: descriptionValue,
    //     type: "auction",
    //     address: user.userAddress,
    //   })
    // );
    // formData.append("file", file);
    // axios
    //   .post("/api/images/", , {
    //     header: { "content-type": "multipart/form-data" },
    //   })

    const body = {
      ownerEmail: user.email,
      url: urlStr,
      current_price: startPriceValue,
      buyout: buyoutValue,
      limit_hours: period,
      markup: Markup,
      description: descriptionValue,
      type: "auction",
      onMarket: false,
      soldOut: false,
      networkId: networkId,
      tokenId: totalSupply - 1,
      contractAddress: address,
      name: nameValue,
      starting_time: new Date(),
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
                console.log(receipt);
                alert(res.data.message);
                setfile("");
                resetName();
                resetBuyout();
                resetDescription();
                resetStartPrice();
                setPeriod(12);
                setMarkup(5);
              })
              .catch(async (err) => {
                alert(err.message);
                console.log(err);
                //db에 추가한 row 삭제하기
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
  };
  console.log("file: ", file, file?.name, file?.filename);
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
              ref={nameRef}
              value={nameValue || ""}
            />
            {nameHasError && (
              <p className={styles["error-text"]}>
                Name을 4자 이상 입력하세요.
              </p>
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
              ref={priceRef}
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
              ref={buyoutRef}
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
          <Grid item xs={12}>
            <span className={styles["form-input-name"]}>Description</span>
            <textarea
              type="text"
              required
              className="form-control my-2"
              placeholder="Description"
              rows="3"
              ref={descriptionRef}
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
