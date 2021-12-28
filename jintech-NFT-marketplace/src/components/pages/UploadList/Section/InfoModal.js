import React from "react";

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid,
  Card,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import styles from "./InfoModal.module.css";

const InfoModal = (props) => {
  const { open, handleClose, selectedData } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Use Google's location service?"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1} columns={18}>
          <Grid item xs={8} sm={6}>
            <Card
              sx={{
                maxHeight: 197,
                margin: "0.5rem",
                minHeight: 170,
                backgroundColor: "rgb(182, 182, 182)",
                overflow: "auto",
              }}
            >
              <img
                src={selectedData?.url}
                alt={selectedData?.url}
                className={styles.images}
              />
            </Card>
          </Grid>
          <Grid item xs={10} sm={12}>
            <Box sx={{ mt: 1, pr: 2 }}>
              <TextField
                id="email"
                label="Owner"
                defaultValue={selectedData.email}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
                sx={{ m: 1 }}
                fullWidth
              />
              <TextField
                id="filename"
                label="File Name"
                defaultValue={selectedData.filename}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ m: 1 }}
                variant="standard"
                fullWidth
              />
              <TextField
                id="url"
                label="URL"
                defaultValue={selectedData.url}
                InputProps={{
                  readOnly: true,
                }}
                title={selectedData.url}
                sx={{ m: 1 }}
                variant="standard"
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={18} sm={18} sx={{ mt: 1, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={9} sm={6} sx={{ pr: 2 }}>
                <TextField
                  id="type"
                  label="Type"
                  defaultValue={selectedData.type}
                  sx={{ m: 1 }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={9} sm={6} sx={{ pr: 2 }}>
                <TextField
                  id="price"
                  label="Price"
                  defaultValue={selectedData.price}
                  sx={{ m: 1 }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={9} sm={6} sx={{ pr: 2 }}>
                <TextField
                  id="period"
                  label="Period"
                  defaultValue={selectedData.period}
                  sx={{ m: 1 }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={9} sm={6} sx={{ pr: 2 }}>
                <TextField
                  id="buyout"
                  label="Buyout"
                  defaultValue={selectedData.buyout}
                  sx={{ m: 1 }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={9} sm={6} sx={{ pr: 2 }}>
                <TextField
                  id="markup"
                  label="Markup"
                  defaultValue={selectedData.markup}
                  sx={{ m: 1 }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={9} sm={6} sx={{ pr: 2 }}>
                <TextField
                  id="createdAt"
                  label="CreatedAt"
                  defaultValue={new Date(
                    selectedData.createdAt
                  ).toLocaleString()}
                  sx={{ m: 1 }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={18}>
            <TextField
              id="description"
              label="Description"
              multiline
              rows={2}
              defaultValue={selectedData.description}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleClose} autoFocus>
          MINT
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoModal;
