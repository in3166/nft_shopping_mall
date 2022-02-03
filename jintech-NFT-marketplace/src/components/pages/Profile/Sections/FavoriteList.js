import { Box, Button, Card, CircularProgress, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import styles from "./UserUploadList.module.css";

// const currencyFormatter = new Intl.NumberFormat("en-IN", {
//   maximumSignificantDigits: 3,
// });

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 50,
    disableColumnMenu: true,
    sortable: false,
  },
  //   { field: "email", headerName: "E-Mail", width: 130 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
    renderCell: (params) => <div title={params.value}>{params.value}</div>,
  },
  {
    field: "current_price",
    headerName: "Price",
    width: 90,
  },

  {
    field: "ownerEmail",
    headerName: "Owner",
    width: 170,
    type: "number",
  },
  {
    field: "description",
    headerName: "Description",
    width: 190,
    renderCell: (params) => <div title={params.value}>{params.value}</div>,
  },
  {
    field: "onMarket",
    headerName: "Market",
    width: 80,
  },
  {
    field: "createdAt",
    headerName: "Created",
    width: 200,
    renderCell: (params) => (
      <div>{new Date(params.value).toLocaleString()}</div>
    ),
  },
];

const FavoriteList = () => {
  //   const [rows, setRows] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const [open, setOpen] = useState(false);
  const [isMount, setisMount] = useState(true);
  const [Loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const handleClose = () => {
    setOpen(false);
  };

  const [Likes, setLikes] = useState([]);
  const getAllLikes = useCallback(() => {
    axios
      .get("/api/marketplaces/favorites/" + user.email)
      .then((res) => {
        console.log("likesss: ", res.data);
        setLikes(res.data);
      })
      .catch((err) => {
        alert(err);
      });
  }, [user.email]);

  useEffect(() => {
    getAllLikes();
    return () => {
      setisMount(false);
      setOpen(false);
    };
  }, [getAllLikes]);

  const infoHandler = async (data) => {
    setSelectedData(data);
    //const path = data.path.replaceAll(/\\/g, "/");
    //console.log(path);
    //const image = await axios.get("/" + path);
    // try {
    //   const image = await axios.get("/api/images/image?path=" + data.path);
    //   console.log("IMAGE?:", image);
    // } catch (error) {
    //   console.log(error);
    // }

    setOpen(true);
  };

  return (
    <Box className={styles.box}>
      {/* <div className={styles.buttonDiv}>
  <Button variant="outlined" className={styles.button}>
    수정
  </Button>
  <Button variant="outlined" className={styles.button}>
    삭제
  </Button>
</div> */}
      <Card className={styles.card}>
        {Loading && (
          <Stack
            sx={{
              color: "grey.500",
              width: "100%",
              minHeight: "250px",
              justifyContent: "center",
              alignItems: "center",
            }}
            spacing={2}
            direction="row"
            className={styles.loading}
          >
            <CircularProgress color="inherit" />
          </Stack>
        )}
        {!Loading && (
          <DataGrid
            rows={Likes}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            //checkboxSelection
            autoHeight={true}
            onRowClick={(data) => infoHandler(data.row)}
            disableSelectionOnClick
          />
        )}
      </Card>

      {/* {open && (
        <InfoModal
          open={open}
          handleClose={handleClose}
          selectedData={selectedData}
        />
      )} */}
    </Box>
  );
};

export default FavoriteList;
