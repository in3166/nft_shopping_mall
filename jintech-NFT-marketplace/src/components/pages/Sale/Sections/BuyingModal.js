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
import React from "react";

const BuyingModal = (props) => {
  const { Open, handleClose, Image } = props;
  const handleMintSubmit = () => {};
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
          {"800 ETH"}
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
            onClick={handleMintSubmit}
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
