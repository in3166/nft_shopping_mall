import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import styles from "./UserList.module.css";
import Card from "../UI/Card/Card";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AuthContext from "../../store/auth-context";
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

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
    align: "center",
    headerAlign: "center",
  },
  { field: "email", headerName: "E-Mail", width: 230 },
  {
    field: "auth",
    headerName: "이메일 인증",
    width: 110,
    align: "center",
    headerAlign: "center",
  },
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

const UserList = () => {
  const authCtx = useContext(AuthContext);
  const [Users, setUsers] = useState([]);
  const [PopOpen, setPopOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const history = useHistory();
  const gridRef = useRef();

  const getUsers = useCallback(() => {
    setLoading(true);
    if (authCtx.isAdmin) {
      const body = {
        token: authCtx.token,
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
              auth: v.auth,
              leave: v.leave,
              otp: v.otp,
            };
          });
          setUsers(users);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      alert("관리자 계정이 아닙니다.");
      history.push("/");
    }
  }, [authCtx.isAdmin, history, authCtx.token]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const buttonLeaveClickHandler = (data) => {
    console.log(data);
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
      if (data.row.leave === "Y") {
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
    console.log(data);
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
          // disableSelectionOnClick
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
