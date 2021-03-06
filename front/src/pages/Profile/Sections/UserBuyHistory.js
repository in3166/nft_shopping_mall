import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 50,
    disableColumnMenu: true,
    sortable: false,
    align: "center",
  },
  {
    field: "name",
    headerName: "Name",
    width: 220,
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
    renderCell: (params) => params.value?.toLocaleString(),
  },
  {
    field: "createdAt",
    headerName: "날짜",
    width: 200,
    renderCell: (params) => (
      <div>{new Date(params.value)?.toLocaleString()}</div>
    ),
  },
];

const UserBuyHistory = () => {
  const [BuyHistory, setBuyHistory] = useState([]);
  const [TotalPrice, setTotalPrice] = useState(0);
  const user = useSelector((state) => state.user.user);

  const getAllBuyHistory = useCallback(() => {
    axios
      .get("/api/markethistories/buys/" + user.email)
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.buyHistory);
          setBuyHistory(res.data.buyHistory);
          const tempPrice = res.data?.buyHistory?.reduce(
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
    getAllBuyHistory();
  }, [getAllBuyHistory]);
  return (
    <>
      <div>
        <label>총 구매 가격: {TotalPrice.toLocaleString()}</label>
      </div>
      <DataGrid
        rows={BuyHistory}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        autoHeight={true}
        disableSelectionOnClick
      />
    </>
  );
};

export default UserBuyHistory;
