import { Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./SalesAnalysis.module.css";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
    align: "center",
    headerAlign: "center",
  },
  { field: "userEmail", headerName: "Buyer", width: 200 },
  {
    field: "price",
    headerName: "Price",
    width: 100,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <div>{params.value.toLocaleString()}</div>,
  },
  {
    field: "createdAt",
    headerName: "생성일",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <div>{new Date(params.value).toLocaleString()}</div>
    ),
  },
];

const SalesAnalysis = () => {
  const today = new Date().toISOString().split("T")[0].toString();
  const gridRef = useRef();
  const [select, setSelection] = useState([]);
  const [Sales, setSales] = useState([]);
  const [PeriodSales, setPeriodSales] = useState([]);
  const [TotalPrice, setTotalPrice] = useState(0);
  const [StartDate, setStartDate] = useState(today);
  const [EndDate, setEndDate] = useState(today);

  const getSales = useCallback(() => {
    axios
      .get("/api/markethistories/sales")
      .then((res) => {
        if (res.data.success) {
          console.log("res.data.sales: ", res.data.sales);
          setSales(res.data.sales);
          const todaySales = res.data.sales.filter(
            (value) =>
              new Date(value["createdAt"])
                .toISOString()
                .split("T")[0]
                .toString() === today
          );
          const tempTotalPrice = todaySales.reduce(
            (prevValue, curValue) => prevValue + curValue.price,
            0
          );
          setTotalPrice(tempTotalPrice);
          setPeriodSales(todaySales);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, [today]);

  const onSelectedRowHandler = (data) => {
    console.log(data);
    setSelection(data);
  };

  useEffect(() => {
    getSales();
  }, [getSales]);

  const confirmPeriod = () => {
    const tempSales = Sales.filter(
      (v) =>
        new Date(v.createdAt) <= new Date(EndDate + " 23:59:59") &&
        new Date(v.createdAt) >= new Date(StartDate + " 00:00:00")
    );
    setPeriodSales(tempSales);
    const tempTotalPrice = tempSales.reduce(
      (prevValue, curValue) => prevValue + curValue.price,
      0
    );
    setTotalPrice(tempTotalPrice);
  };

  const startDateChangeHandler = (e) => {
    if (new Date(e.target.value) > new Date(EndDate)) {
      alert("종료 날짜 이전의 날짜를 선택하세요.");
      return;
    }
    setStartDate(e.target.value);
  };

  const endDateChangeHandler = (e) => {
    if (new Date(today) < new Date(e.target.value)) {
      alert("오늘 이전의 날짜를 선택하세요.");
      return;
    }

    if (new Date(e.target.value) < new Date(StartDate)) {
      alert("시작 날짜 이후의 날짜를 선택하세요.");
      return;
    }
    setEndDate(e.target.value);
  };
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.date}>
          <TextField
            id="date"
            label="Start"
            type="date"
            size="small"
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
            value={StartDate}
            onChange={startDateChangeHandler}
          />
          <TextField
            id="dateEnd"
            label="End"
            type="date"
            size="small"
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
            value={EndDate}
            onChange={endDateChangeHandler}
          />
          <Button id="dateConfirm" variant="outlined" onClick={confirmPeriod}>
            확인
          </Button>
        </div>
        <div>
          <label>총 매출: {TotalPrice.toLocaleString()}</label>
        </div>
      </div>
      <br />
      <DataGrid
        rows={PeriodSales}
        columns={[...columns]}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        // disableSelectionOnClick
        ref={gridRef}
        selectionModel={select}
        onSelectionModelChange={(data) => {
          onSelectedRowHandler(data);
        }}
      />
    </div>
  );
};
export default SalesAnalysis;
