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
import React from "react";
import { useSelector } from "react-redux";

const BuyingModal = (props) => {
  const { Open, handleClose, Image, setImage } = props;
  const user = useSelector((state) => state.user.user);

  const handleBuySubmit = () => {
    const body = {
      action: "buy",
      price: Image.image.buyout,
      userEmail: user.email,
      marketplaceId: Image.id,
    };
    axios
      .post("/api/marketHistories", body)
      .then((res) => {
        if (res.data.success) {
          alert("성공");
          setImage((prev) => {
            return {
              ...prev,
              current_price: res.data.current_price,
              soldOut: true,
            };
          });
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        handleClose();
      });
    console.log(body);
  };
  return (
    <Dialog
      //fullScreen={fullScreen}
      open={Open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      PaperProps={{
        style: { borderRadius: 25 },
      }}
    >
      <Box sx={{ p: 6 }}>
        <div style={{ textAlign: "center" }}>You Will Pay</div>
        <DialogTitle id="responsive-dialog-title" sx={{ textAlign: "center" }}>
          {Image.image.buyout.toLocaleString("ko-KR")} ETH
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
              Once the payment becomes successful, you will own this product
              directly.
            </div>
            <br />
            <br />
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <InputLabel color="warning" htmlFor="standard-adornment-amount">
                Available
              </InputLabel>
              <Input
                id="standard-adornment-amount"
                //onChange={handleChange("amount")}
                color="warning"
                readOnly
                defaultValue={3}
                endAdornment={
                  <InputAdornment position="end">ETH</InputAdornment>
                }
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleBuySubmit}
            variant="outlined"
            color="warning"
            sx={{ p: 1, pr: 5, pl: 5 }}
          >
            Confirm
          </Button>
        </DialogActions>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span>Available balance: 0 ETH</span>
        </div>
      </Box>
    </Dialog>
  );
};

export default BuyingModal;
