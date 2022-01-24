import { DataGrid } from "@mui/x-data-grid";
import React, { useRef } from "react";

const UserHistory = (props) => {
  const { rows, columns } = props;
  const gridRef = useRef();

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
      pageSize={5}
      rowsPerPageOptions={[5]}
      disableSelectionOnClick
      ref={gridRef}
      sx={{ cursor: "pointer" }}
    />
  );
};

export default UserHistory;
