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

const BiddingModal = (props) => {
  const { Open, handleClose, Image } = props;
  const handleMintSubmit = () => {};
  return (
    <Dialog
      //fullScreen={fullScreen}
      open={Open}
      onClose={handleClose}
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
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom:'10px' }}>
                <span>Current Bid</span>
                <span>220 ETH</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Minimum Markup</span>
                <span>11 ETH</span>
              </div>
            </div>
            <br />
            <br />
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <InputLabel  color="warning" htmlFor="standard-adornment-amount">Bid</InputLabel>
              <Input
                id="standard-adornment-amount"
                //onChange={handleChange("amount")}
                autoFocus
                color="warning"
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
