import {
  Button,
  Paper,
  List,
  IconButton,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItem,
  ListItemText,
  Popover,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./AdminManager.module.css";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
    align: "center",
    headerAlign: "center",
  },
  { field: "email", headerName: "E-Mail", width: 200 },
  {
    field: "otp",
    headerName: "OTP",
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

const AdminManager = (props) => {
  const state = useSelector((state) => state.user);
  const gridRef = useRef();

  const [DeletedCategoriesId, setDeletedCategoriesId] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Users, setUsers] = useState([]);
  const [isMount, setisMount] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [checked, setChecked] = useState([]);
  const [PopOpen, setPopOpen] = useState(false);
  const [DialogValue, setDialogValue] = useState("");
  const [select, setSelection] = useState([]);

  const getUsers = useCallback(() => {
    setLoading(true);

    const body = {
      email: state.user.email,
    };

    axios
      .post("api/users/allUsers", body)
      .then((res) => {
        console.log(res);
        const users = res.data.map((v, i) => {
          // 관리자 db 열 없음
          return {
            id: i,
            email: v.email,
            created: new Date(v.createdAt).toLocaleString(),
            email_verification: v.email_verification,
            leave: v.leave,
            otp: v.otp ? "Y" : "N",
          };
        });
        if (isMount) setUsers(users);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [state.user.email, isMount]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleDeleteClick = (event, value) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteClose = () => {
    setAnchorEl(null);
    setSelection([]);
  };

  const handleDeleteConfirm = () => {
    if (select.length === 0) {
      alert("하나 이상의 계정을 선택하세요.");
      return;
    }
    console.log(select);
    handleDeleteClose();
    console.log(select);
    // 해당 계정 삭제
  };

  const deleteOpen = Boolean(anchorEl);
  const id = deleteOpen ? "simple-popover" : undefined;

  const [isAdd, setIsAdd] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const handleClickAddOpen = () => {
    setAddOpen(true);
    setIsAdd(true);
    setDialogValue("");
  };

  const handleAddClose = () => {
    setAddOpen(false);
    setDialogValue("");
  };

  const leaveButtonColumn = {
    field: "leave",
    headerName: "비밀번호",
    width: 100,
    sortable: false,
    align: "center",
    headerAlign: "center",
    renderCell: (data) => {
      return (
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsAdd(false);
              setAddOpen(true);
              console.log(e.target);
            }}
            aria-describedby={id}
            variant="outlined"
            size="small"
            color="info"
          >
            변경
          </Button>
        </div>
      );
    },
  };

  const onSelectedRowHandler = (data) => {
    console.log(data);
    setSelection(data);
  };

  const handleDialogConfirm = () => {
    console.log(DialogValue);
  };

  return (
    <>
      <h4 className={styles["head-text"]}>ADMIN MANAGER</h4>

      <Paper elevation={3}>
        <div className={styles["header"]}>
          <div className={styles["btn-div"]}>
            {/* <Button onClick={handleClickEditOpen}>Edit</Button> */}
            <Button onClick={handleClickAddOpen}>Add</Button>
            <Button onClick={handleDeleteClick}>Delete</Button>
          </div>
        </div>

        {!Loading && (
          <DataGrid
            rows={Users}
            columns={[...columns, leaveButtonColumn]}
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
        )}
      </Paper>

      <Popover
        id={id}
        open={deleteOpen}
        anchorEl={anchorEl}
        onClose={handleDeleteClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Typography sx={{ p: 2 }}>정말 삭제하시겠습니까?</Typography>
        <div style={{ float: "right" }}>
          <Button onClick={handleDeleteClose}>취소</Button>
          <Button onClick={handleDeleteConfirm}>삭제</Button>
        </div>
      </Popover>

      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>{isAdd ? "Add" : "Edit"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isAdd
              ? "추가할 운영자 이메일을 입력하세요."
              : "변경할 비밀번호를 입력하세요."}
          </DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            id="dialog"
            label={isAdd ? "E-Mail" : "Password"}
            type="text"
            fullWidth
            variant="standard"
            value={DialogValue}
            onChange={(e) => {
              setDialogValue(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>취소</Button>
          <Button onClick={handleDialogConfirm}>
            {isAdd ? "추가" : "수정"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminManager;
