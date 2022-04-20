import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
    width: 160,
    renderCell: (params) => (
      <div title={params?.row?.marketplace?.name}>
        {params?.row?.marketplace?.name}
      </div>
    ),
  },
  {
    field: "price",
    headerName: "가격",
    width: 100,
    type: "number",
    renderCell: (params) => params.value.toLocaleString(),
  },
  {
    field: "createdAt",
    headerName: "날짜",
    width: 200,
    renderCell: (params) => (
      <div>{new Date(params.value).toLocaleString()}</div>
    ),
  },
];

const UserSaleHistory = () => {
  const [SaleHistory, setSaleHistory] = useState([]);
  const [TotalPrice, setTotalPrice] = useState(0);
  const user = useSelector((state) => state.user.user);

  const getAllSaleHistory = useCallback(() => {
    axios
      .get("/api/markethistories/sales/" + user.email)
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.saleHistory);
          setSaleHistory(res.data.saleHistory);
          const tempPrice = res.data?.saleHistory?.reduce(
            (prev, cur) => prev + cur.price,
            0
          );
          setTotalPrice(tempPrice);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, [user.email]);

  useEffect(() => {
    getAllSaleHistory();
  }, [getAllSaleHistory]);
  return (
    <>
      <div>
        <label>총 판매 가격: {TotalPrice.toLocaleString()}</label>
      </div>
      <DataGrid
        rows={SaleHistory}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        // checkboxSelection
        autoHeight={true}
        // onRowClick={(data) => infoHandler(data.row)}
        disableSelectionOnClick
      />
    </>
  );
};

export default UserSaleHistory;
