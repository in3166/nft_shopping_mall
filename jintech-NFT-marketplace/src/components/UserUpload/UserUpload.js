import { Container, Grid, Input, Slider } from "@mui/material";
import { Box, createSpacing, spacing } from "@mui/system";
import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import Card from "../UI/Card/Card";
import styles from "./UserUpload.module.css";

const UserUpload = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const [period, setPeriod] = useState(12);
  const getAccount = useCallback(async () => {
    const accounts = await window.web3.eth.getAccounts();
    console.log(accounts[0]);
    if (accounts) {
      await axios.get(`/api/users/user/${authCtx.email}`).then((res) => {
        console.log(res.data.address);
        if (accounts[0] !== res.data.address) {
          if (authCtx.isLoggedIn) {
            alert("지갑 주소가 맞지 않습니다.");
            history.replace("/");
          }

          authCtx.address = accounts[0];
        }
      });
    }
  }, [history, authCtx]);

  useEffect(() => {
    getAccount();
  }, [getAccount]);

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

  return (
    <Card>
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          border: "1px rgb(196, 196, 196) solid",
        }}
      >
        <h5>Select your file</h5>
      </Box>
      <Container className={styles.container}>
        <h3 className="mb-4">상품 등록</h3>
        <form className="row text-end" onSubmit={}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <span className={styles["form-input-name"]}>이미지</span>
              <input
                type="file"
                required
                className="form-control my-2"
                placeholder="Choose Image"
              />
            </Grid>
            <Grid item xs={6}>
              <span className={styles["form-input-name"]}>URL</span>
              <input
                type="text"
                required
                className="form-control my-2"
                placeholder="Name"
              />
            </Grid>
            {/*  2021-11-20  주석처리 (자동 입력)
                  <div className="col-6">
                    <input
                      type='text' required
                      className='form-control my-2'
                      placeholder='Url'
                      onChange={event => this.setState({ new_url: event.target.value })}
                    />
                  </div>
                  */}
            <Grid item xs={6}>
              <span className={styles["form-input-name"]}>시작가</span>
              <input
                type="number"
                required
                className="form-control my-2"
                placeholder="Price in Ebizon Tokens"
              />
            </Grid>
            <Grid item xs={6}>
              <span className={styles["form-input-name"]}>BuyOut</span>
              <input
                type="number"
                required
                className="form-control my-2"
                placeholder="Price in Ebizon Tokens"
              />
            </Grid>
            <Grid item xs={6}>
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
                  <Input
                    value={period}
                    size="small"
                    onChange={handlePeriodInputChange}
                    onBlur={handlePeriodBlur}
                    inputProps={{
                      step: 1,
                      min: 12,
                      max: 168,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <span className={styles["form-input-name"]}>Markup</span>
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
                  <Input
                    value={period}
                    size="small"
                    onChange={handlePeriodInputChange}
                    onBlur={handlePeriodBlur}
                    inputProps={{
                      step: 1,
                      min: 5,
                      max: 20,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
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
              />
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
    </Card>
  );
};

export default UserUpload;
