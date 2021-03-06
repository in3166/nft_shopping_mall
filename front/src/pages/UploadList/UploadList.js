import { Box, Stack, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../components/Card/Card";
import ConfirmSaleModal from "./Section/ConfirmSaleModal";
import styles from "./UploadList.module.css";

// 사용자가 업로드 가능하면 목록을 관리자가 확인 후 승인 과정 - 사용 x
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumSignificantDigits: 3,
});

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "email", headerName: "E-Mail", width: 130 },
  {
    field: "filename",
    headerName: "File name",
    width: 300,
    renderCell: (params) => <div title={params.value}>{params.value}</div>,
  },
  {
    field: "type",
    headerName: "Type",

    width: 90,
  },

  {
    field: "price",
    headerName: "가격",
    type: "number",
    width: 90,
    valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
  },
  {
    field: "period",
    headerName: "기간 (h)",
    width: 90,
    valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
  },
  {
    field: "buyout",
    headerName: "Buyout",
    width: 90,
    type: "number",
    valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
  },
  {
    field: "markup",
    headerName: "Markup",
    width: 90,
    type: "number",
    valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
  },
  { field: "description", headerName: "설명", width: 90 },
  { field: "approval", headerName: "승인", width: 90 },
  { field: "onMarket", headerName: "onMarket", width: 90 },
  { field: "token", headerName: "Token", width: 90 },
  {
    field: "createdAt",
    headerName: "등록일",
    width: 200,
    renderCell: (params) => (
      <div>{new Date(params.value).toLocaleString()}</div>
    ),
  },
  {
    field: "url",
    headerName: "URL",
    width: 190,
    renderCell: (params) => <div title={params.value}>{params.value}</div>,
  },
  {
    field: "path",
    headerName: "Path",
    width: 140,
  },
];

const UploadList = () => {
  const [rows, setRows] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const [open, setOpen] = React.useState(false);
  const [isMount, setisMount] = useState(true);
  const [Loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const user = useSelector((state) => state.user.user);

  const getAllUploadImages = useCallback(() => {
    setLoading(true);
    console.log("getAllUploadImages all", user.email);
    axios
      .get("/api/images/", {
        headers: { email: user.email },
      })
      .then((res) => {
        console.log(res.data);
        if (isMount) setRows(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      })
      .finally(() => {
        if (isMount) setLoading(false);
      });
  }, [isMount, user.email]);

  useEffect(() => {
    getAllUploadImages();
    return () => {
      setisMount(false);
    };
  }, [getAllUploadImages]);

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
      <Card>
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
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            autoHeight={true}
            onRowClick={(data) => infoHandler(data.row)}
            disableSelectionOnClick
            className={styles.table}
          />
        )}
      </Card>

      {open && (
        <ConfirmSaleModal
          open={open}
          handleClose={handleClose}
          selectedData={selectedData}
        />
      )}
    </Box>
  );
};

export default UploadList;
