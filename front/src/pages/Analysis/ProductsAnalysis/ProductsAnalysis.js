import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import InfoModal from "./Sections/InfoModal";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "name",
    headerName: "Name",
    width: 310,
    renderCell: (params) => {
      return <div title={params?.row?.name}>{params?.row?.name}</div>;
    },
  },
  {
    field: "ownerEmail",
    headerName: "소유자",
    width: 190,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "createdAt",
    headerName: "생성일",
    width: 190,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div>{new Date(params.value).toLocaleString()}</div>;
    },
  },
];

const ProductsAnalysis = () => {
  const gridRef = useRef();
  const [MarketList, setMarketList] = useState([]);
  const [select, setSelection] = useState([]);

  const onSelectedRowHandler = (data) => {
    setSelection(data);
  };

  const getAllMarket = () => {
    axios
      .get("/api/marketplaces/all")
      .then((res) => {
        if (res.data.success) {
          setMarketList(res.data.images);
          console.log(res.data.images);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  useEffect(() => {
    getAllMarket();
  }, []);

  const [ModalOpen, setModalOpen] = useState(false);
  const [SelectedData, setSelectedData] = useState({});
  const openInfoHandler = (data) => {
    console.log("selected: ", data);
    setSelectedData(data);
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <DataGrid
        rows={MarketList}
        columns={columns}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        ref={gridRef}
        selectionModel={select}
        onSelectionModelChange={(data) => {
          onSelectedRowHandler(data);
        }}
        onRowClick={(data) => openInfoHandler(data.row)}
      />
      {ModalOpen && (
        <InfoModal
          open={ModalOpen}
          handleClose={handleClose}
          selectedData={SelectedData}
        />
      )}
    </>
  );
};

export default ProductsAnalysis;
