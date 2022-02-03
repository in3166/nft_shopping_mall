export const imageColumns = [
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
    width: 110,
    align: "center",
    headerAlign: "center",
  },
  { field: "current_price", headerName: "Price", width: 90 },
  {
    field: "onMarket",
    headerName: "onMarket",
    width: 90,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "createdAt",
    headerName: "생성일",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
];

export const buyColumns = [
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
    width: 110,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div title={params?.row?.marketplace?.name}>{params?.row?.marketplace?.name}</div>;
    },
  },
  { field: "price", headerName: "Price", width: 90 },
  {
    field: "createdAt",
    headerName: "생성일",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
];

export const saleColumns = [
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
    width: 110,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div title={params?.row?.marketplace?.name}>{params?.row?.marketplace?.name}</div>;
    },
  },
  { field: "price", headerName: "Price", width: 90 },
  {
    field: "createdAt",
    headerName: "생성일",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
];

export const bidColumns = [
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
    width: 110,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return <div title={params?.row?.marketplace?.name}>{params?.row?.marketplace?.name}</div>;
    },
  },
  { field: "price", headerName: "Price", width: 90 },
  {
    field: "createdAt",
    headerName: "생성일",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
];
