import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "../Sale.module.css";

const BiddingModal = (props) => {
  const {
    Open,
    handleClose,
    Image,
    setImage,
    getAllBidHistory,
    EndTime,
    buyout,
  } = props;
  const user = useSelector((state) => state.user.user);
  const [isOverMarkup, setisOverMarkup] = useState(false);
  const [isUnderPrice, setisUnderPrice] = useState(false);
  const [Price, setPrice] = useState("");

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    if (Image.current_price + Image.image.markup < Number(e.target.value)) {
      setisOverMarkup(true);
      setisUnderPrice(false);
    } else if (Number(e.target.value) <= Image.current_price) {
      setisUnderPrice(true);
      setisOverMarkup(false);
    } else {
      setisOverMarkup(false);
      setisUnderPrice(false);
    }
  };

  const handleBidSubmit = () => {
    if (EndTime) return;
    if (!isOverMarkup && !isUnderPrice) {
      const body = {
        action: "bid",
        price: Price,
        marketplaceId: Image.id,
        userEmail: user.email,
        starting_time: Image.starting_time,
      };
      if (Price >= buyout) {
        alert("Buyout 이상의 가격입니다.");
        return;
      }

      console.log(body);
      axios
        .post("/api/marketHistories", body)
        .then((res) => {
          if (res.data.success) {
            alert("등록 성공");
            setImage((prev) => {
              return { ...prev, current_price: res.data.current_price };
            });
            getAllBidHistory();
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          alert(err);
        })
        .finally(() => {
          handleModalClose();
        });
    }
  };

  const handleModalClose = () => {
    setisOverMarkup(false);
    setisUnderPrice(false);
    handleClose();
    setPrice("");
  };

  return (
    <Dialog
      //fullScreen={fullScreen}
      open={Open}
      onClose={handleModalClose}
      aria-labelledby="responsive-dialog-title"
      className="diaa"
      PaperProps={{
        style: { borderRadius: 25 },
      }}
    >
      <Box sx={{ p: 6 }}>
        <DialogTitle id="responsive-dialog-title" sx={{ textAlign: "center" }}>
          {"Your bid"}
        </DialogTitle>
        <DialogContent sx={{ alignSelf: "center" }}>
          <Box
            sx={{
              mt: 1,
              pr: 2,
              alignSelf: "center",
              maxWidth: 350,
              width: 350,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span>Current Bid</span>
                <span>{Image.current_price.toLocaleString("ko-KR")} ETH</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Minimum Markup</span>
                <span>{Image.image.markup.toLocaleString("ko-KR")} ETH</span>
              </div>
            </div>
            <br />
            <br />
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <InputLabel color="warning" htmlFor="standard-adornment-amount">
                Bid
              </InputLabel>
              <Input
                id="standard-adornment-amount"
                onChange={handlePriceChange}
                value={Price}
                autoFocus
                type="number"
                color="warning"
                endAdornment={
                  <InputAdornment position="end">ETH</InputAdornment>
                }
              />
            </FormControl>
            {isUnderPrice && (
              <p className={styles["modal-error-message"]}>
                현재 가격보다 적은 금액입니다.
              </p>
            )}
            {isOverMarkup && (
              <p className={styles["modal-error-message"]}>
                마크업을 초과하였습니다.
              </p>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleBidSubmit}
            variant="outlined"
            color="warning"
            sx={{ p: 1, pr: 5, pl: 5 }}
          >
            Place a bid
          </Button>
        </DialogActions>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span>Available balance: 0 ETH</span>
        </div>
      </Box>
    </Dialog>
  );
};

export default BiddingModal;
