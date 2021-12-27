import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "../../UI/Card/Card";
import styles from "./UploadList.module.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "email", headerName: "E-Mail", width: 130 },
  { field: "filename", headerName: "File name", width: 300 },
  {
    field: "type",
    headerName: "Type",
    type: "number",
    width: 90,
  },
  {
    field: "path",
    headerName: "Path",
    width: 140,
  },
  { field: "url", headerName: "URL", width: 90 },
  { field: "price", headerName: "가격", width: 90 },
  { field: "period", headerName: "기간", width: 90 },
  { field: "buyout", headerName: "Buyout", width: 90 },
  { field: "markup", headerName: "Markup", width: 90 },
  { field: "description", headerName: "설명", width: 90 },
  { field: "approval", headerName: "승인", width: 90 },
  { field: "onMarket", headerName: "onMarket", width: 90 },
  { field: "createdAt", headerName: "등록일", width: 130 },
];

const UploadList = () => {
  const [rows, setRows] = useState([]);
  const [selectedData, setSelectedData] = useState({});

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    setOpen(false);
  };

  const getAllUploadImages = () => {
    axios
      .get("/api/images/")
      .then((res) => {
        console.log(res);
        setRows(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllUploadImages();
  }, []);

  const infoHandler = async (data) => {
    console.log(data);
    setSelectedData(data);

    const image = await axios.get("/api/images?path=" + data.path);
    console.log("IMAGE?:", image);
    
    setOpen(true);
  };

  return (
    <Box className={styles.box}>
      <Card>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          autoHeight={true}
          onRowClick={(data) => infoHandler(data.row)}
          disableSelectionOnClick
        />
      </Card>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{JSON.stringify(selectedData)}</DialogContentText>
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
    </Box>
  );
};

export default UploadList;
