import {
  Backdrop,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";

const SecondAuthentication = (props) => {
  // const { value } = props;
  const authCtx = useContext(AuthContext);
  const [invisible, setInvisible] = useState(() => authCtx.otp === "Y");

  const [secret, setsecret] = useState("");
  const [url, seturl] = useState("");
  //const [code, setcode] = useState("");

  const getQR = useCallback(() => {
    axios.get("/api/auth/" + authCtx.email).then((res) => {
      console.log(res.data);
      setsecret(res.data.secret);
      seturl(res.data.url);
    });
  }, [authCtx.email]);

  useEffect(() => {
    if (authCtx.otp === "Y") getQR();
    return () => {};
  }, [authCtx.otp, getQR]);

  const handleBadgeVisibility = () => {
    if (authCtx.otp === "N") {
      getQR();
      authCtx.otp = "Y";
      setInvisible((prev) => !prev);
    } else {
      axios
        .put("/api/auth/" + authCtx.email)
        .then((res) => {
          console.log("비활성화 성공", res);
          authCtx.otp = "N";
          setInvisible(false);
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    }
  };

  useEffect(() => {
    if (authCtx.otp === "Y") {
      getQR();
    }
  }, [authCtx.otp, getQR]);

  const [loading, setLoading] = useState(false);
  const resetQRHandler = () => {
    setLoading(true);
    const body = { email: authCtx.email };
    axios
      .post("/api/auth/", body)
      .then((res) => {
        console.log(res.data);
        setsecret(res.data.secret);
        seturl(res.data.url);
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
          <Box sx={{ p: 3, border: "1px solid grey", position: "relative" }}>
            <TextField
              id="outlined-read-only-input"
              label="Secret Key"
              value={secret}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              title={secret}
            />
            {url && <img src={url} alt="qrURL" />}
            <br />

            <Backdrop
              sx={{
                color: "#fff",
                position: "absolute",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={loading}
              onClick={() => setLoading(false)}
            >
              <CircularProgress color="secondary" />
            </Backdrop>

            <Button
              color="secondary"
              variant="outlined"
              onClick={resetQRHandler}
            >
              Reset
            </Button>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default SecondAuthentication;
