import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Card from "../../../../UI/Card/Card";
import styles from "./InfoModal.module.css";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "action",
    headerName: "Type",
    width: 110,
  },
  {
    field: "userEmail",
    headerName: "User",
    width: 210,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "price",
    headerName: "Price",
    width: 190,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{params.value.toLocaleString()}</div>;
    },
  },
  {
    field: "createdAt",
    headerName: "Date",
    width: 190,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{new Date(params.value).toLocaleString()}</div>;
    },
  },
];

const InfoModal = (props) => {
  const { open, handleClose, selectedData } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const gridRef = useRef();
  const [Count, setCount] = useState(0);
  const [bidHistory, setbidHistory] = useState([]);

  const getViews = useCallback(() => {
    axios
      .get("/api/views/" + selectedData.id)
      .then((res) => {
        if (res.data.success) {
          setCount(res.data.count);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, [selectedData.id]);

  const getBidHistory = useCallback(() => {
    axios
      .get("/api/marketHistories/" + selectedData.id)
      .then((res) => {
        if (res.data.success) {
          console.log("bid: ", res.data.history);
          setbidHistory(res.data.history);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, [selectedData.id]);

  useEffect(() => {
    getViews();
    getBidHistory();
  }, [getViews, getBidHistory]);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      fullWidth
      maxWidth="xl"
    >
      <DialogTitle id="responsive-dialog-title">{"상세 정보"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={1} columns={18}>
          <Grid item xs={8} sm={6}>
            <Card className={styles.imageCard}>
              <img
                src={selectedData["image"].url}
                alt={selectedData["image"].url}
                className={styles.images}
              />
            </Card>
          </Grid>
          <Grid item xs={10} sm={12}>
            <Box sx={{ mt: 1, pr: 2 }}>
              <TextField
                id="email"
                label="Owner"
                defaultValue={selectedData.ownerEmail}
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
                defaultValue={selectedData?.name}
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
                defaultValue={selectedData?.url}
                InputProps={{
                  readOnly: true,
                }}
                title={selectedData.url}
                sx={{ m: 1 }}
                variant="standard"
                fullWidth
              />
              <TextField
                id="Views"
                label="Views"
                value={Count}
                sx={{ m: 1 }}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
                fullWidth
              />
              <TextField
                id="createdAt"
                label="CreatedAt"
                defaultValue={new Date(selectedData.createdAt).toLocaleString()}
                sx={{ m: 1 }}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
                fullWidth
              />
            </Box>
          </Grid>
          {/* <Grid item xs={18} sm={18} sx={{ mt: 1, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={9} sm={9} sx={{ pr: 2 }}>
                
              </Grid>
              <Grid item xs={9} sm={9} sx={{ pr: 2 }}>
                
              </Grid>
            </Grid>
          </Grid> */}
          <br />
          <Grid item xs={18}>
            <h5>Bid History</h5>
            <DataGrid
              rows={bidHistory}
              columns={columns}
              autoHeight
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              ref={gridRef}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoModal;
