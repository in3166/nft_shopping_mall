import { FormControlLabel, Grid, Switch, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";

const SecondAuthentication = (props) => {
  const { value } = props;
  const [invisible, setInvisible] = useState(false);
  const handleBadgeVisibility = () => {
    setInvisible((prev) => !prev);
  };
  const [secret, setsecret] = useState("");
  const [url, seturl] = useState("");
  const [code, setcode] = useState("");

  const getQR = () => {
    axios.post("/api/auth").then((res) => {
      console.log(res.data);
      setsecret(res.data.secret.base32);
      seturl(res.data.url);
    });
  };

  useEffect(() => {
    if (value === 4) {
      getQR();
    }
  }, [value]);

  return (
    <Grid container sx={{ textAlign: "center" }} justifyContent="center">
      <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
        <div>
          <FormControlLabel
            sx={{ color: "text.primary" }}
            control={
              <Switch checked={invisible} onChange={handleBadgeVisibility} />
            }
            label={invisible ? "2차 인증 활성화" : "2차 인증 비활성화"}
          />
        </div>
        {invisible && (
          <Box sx={{ p: 4, border: "1px solid grey" }}>
            <TextField
              id="outlined-read-only-input"
              label="Secret Key"
              value={secret}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
            {url && <img src={url} alt="qrURL" />}
            <br />
            <input
              id="code"
              onChange={(e) => {
                setcode(e.target.value);
              }}
              value={code}
            />

            <button
              onClick={() => {
                const body = {
                  code,
                  secret,
                };
                console.log(body);
                axios.post("/api/auth/verify", body).then((res) => {
                  console.log(res);
                });
              }}
            >
              확인
            </button>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default SecondAuthentication;
