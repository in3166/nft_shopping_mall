import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
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


const SecondAuthentication = (props) => {
  const { user } = props.user;

  const [invisible, setInvisible] = useState(false);
  const [secret, setsecret] = useState("");
  const [url, seturl] = useState("");

  useEffect(() => {
    axios.get("/api/users/user/" + user?.email).then((res) => {
      setInvisible(res.data.otp);
    });
  }, [user.email]);

  const getQR = useCallback(() => {
    setLoading(true);
    axios
      .get("/api/auth/" + user.email)
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
  }, [user.email]);

  useEffect(() => {
    if (invisible) getQR();
    return () => {};
  }, [getQR, invisible]);

  const handleBadgeVisibility = () => {
    if (!invisible) {
      getQR();
      setInvisible((prev) => !prev);
    } else {
      axios
        .put("/api/auth/" + user.email)
        .then((res) => {
          setInvisible(false);
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    }
  };

  const [loading, setLoading] = useState(false);
  const resetQRHandler = () => {
    setLoading(true);
    const body = { email: user.email };
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
