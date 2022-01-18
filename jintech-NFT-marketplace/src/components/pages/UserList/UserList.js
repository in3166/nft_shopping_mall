import React, { useCallback, useEffect, useState, useRef } from "react";
import styles from "./UserList.module.css";
import Card from "../../UI/Card/Card";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useHistory } from "react-router";
import {
  Button,
  CircularProgress,
  Stack,
  Popover,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useSelector } from "react-redux";

const UserList = () => {
  const [isMount, setisMount] = useState(true);
  const user = useSelector((state) => state.user.user);
  //console.log(state);
  const [Users, setUsers] = useState([]);
  const [PopOpen, setPopOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const history = useHistory();
  const gridRef = useRef();

  function requestOTP(data, row) {
    const token = localStorage.getItem("nft_token");
    const body = {
      token,
      email: row?.email,
      status: data,
    };

    axios
      .post("/api/auth/admin", body)
      .then((res) => {
        if (res.data.success) {
          setUsers((prev) => {
            prev.forEach((value) => {
              if (value.emaill === row.email) {
                value.otp = !value.otp;
              }
            });
            return [...prev];
          });
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    { field: "email", headerName: "E-Mail", width: 210 },
    {
      field: "email_verification",
      headerName: "이메일 인증",
      width: 110,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "otp",
      headerName: "OTP",
      width: 70,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        if (!params.value) {
          return (
            <Button
              sx={{
                borderRadius: "50%",
                minWidth: "min-content",
                padding: "2px 3px 2px 3px",
              }}
              onClick={(e) => {
                e.preventDefault();
                requestOTP("on", params.row);
              }}
            >
              On
            </Button>
          );
        } else {
          return (
            <Button
              color="inherit"
              sx={{
                borderRadius: "50%",
                minWidth: "min-content",
                padding: "2px 3px 2px 3px",
              }}
              onClick={(e) => {
                e.preventDefault();
                requestOTP("off", params.row);
              }}
            >
              Off
            </Button>
          );
        }
      },
    },
    {
      field: "created",
      headerName: "생성일",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  const getUsers = useCallback(() => {
    setLoading(true);

    const body = {
      email: user.email,
    };

    axios
      .post("api/users/allUsers", body)
      .then((res) => {
        const users = res.data.map((v, i) => {
          // 관리자 db 열 없음
          return {
            id: i,
            email: v.email,
            created: new Date(v.createdAt).toLocaleString(),
            email_verification: v.email_verification,
            leave: v.leave,
            otp: v.otp,
          };
        });
        if (isMount) setUsers(users);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user.email, isMount]);

  useEffect(() => {
    getUsers();
    return () => {
      setisMount(false);
    };
  }, [getUsers]);

  const buttonLeaveClickHandler = (data) => {
    axios
      .delete("/api/users/" + data.email)
      .then((res) => {
        if (res.data.success) {
          alert(res.data.message);
        } else {
          alert(res.data.message);
        }
        getUsers();
      })
      .catch((err) => alert(err));
  };

  const [select, setSelection] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const leaveButtonColumn = {
    field: "leave",
    headerName: "탈퇴 승인",
    width: 100,
    sortable: false,
    align: "center",
    headerAlign: "center",
    renderCell: (data) => {
      if (data.row.leave) {
        return (
          <div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(e.currentTarget);
                setPopOpen(true);
              }}
              aria-describedby={id}
              variant="outlined"
              size="small"
              color="info"
            >
              승인
            </Button>
            <Popover
              id={id}
              open={PopOpen}
              anchorEl={anchorEl}
              onClose={() => {
                setPopOpen(false);
              }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "right",
              }}
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  정말로 탈퇴시키겠습니까?
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ p: 0, m: 1 }}>
                <Button
                  onClick={() => {
                    setPopOpen(false);
                  }}
                  sizs="small"
                >
                  취소
                </Button>
                <Button
                  onClick={() => buttonLeaveClickHandler(data.row)}
                  sizs="small"
                  variant="contained"
                >
                  확인
                </Button>
              </DialogActions>
            </Popover>
          </div>
        );
      } else {
        return (
          <Button variant="outlined" size="small" color="info" disabled>
            승인
          </Button>
        );
      }
    },
  };

  const onSelectedRowHandler = (data) => {
    setSelection(data);
  };

  return (
    <Card className={styles["content"]}>
      {Loading && (
        <Stack
          sx={{ color: "grey.500" }}
          spacing={2}
          direction="row"
          className={styles.loading}
        >
          <CircularProgress color="inherit" />
        </Stack>
      )}
      {!Loading && (
        <DataGrid
          rows={Users}
          columns={[...columns, leaveButtonColumn]}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          ref={gridRef}
          onSelectionModelChange={(data) => {
            onSelectedRowHandler(data);
          }}
        />
      )}
    </Card>
  );
};

export default UserList;
