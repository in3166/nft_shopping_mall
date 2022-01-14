import { TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

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
  },
  {
    field: "created",
    headerName: "생성일",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
];

const SalesAnalysis = () => {
  const gridRef = useRef();
  const [Sales, setSales] = useState([]);
  const [select, setSelection] = useState([]);

  const getSales = () => {
    axios
      .get("/api/markethistories/sales")
      .then((res) => {
        if (res.data.success) {
          setSales(res.data.sales);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const onSelectedRowHandler = (data) => {
    console.log(data);
    setSelection(data);
  };

  useEffect(() => {
    getSales();
  }, []);

  console.log(new Date().toISOString().split("T")[0]);
  console.log(Sales);

  return (
    <div>
      <div>
        <TextField
          id="date"
          label="Start"
          type="date"
          size="small"
          defaultValue={new Date().toISOString().split("T")[0].toString()}
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="dateEnd"
          label="End"
          type="date"
          size="small"
          defaultValue={new Date().toISOString().split("T")[0].toString()}
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <DataGrid
        rows={Sales}
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
