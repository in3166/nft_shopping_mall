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
import { CircularProgress, Stack } from "@mui/material";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "email", headerName: "E-Mail", width: 230 },
  { field: "created", headerName: "생성일", width: 250 },
  { field: "auth", headerName: "인증", width: 130 },
  //   {
  //     field: "fullName",
  //     headerName: "Full name",
  //     description: "This column has a value getter and is not sortable.",
  //     sortable: false,
  //     width: 160,
  //     valueGetter: (params) =>
  //       `${params.getValue(params.id, "firstName") || ""} ${
  //         params.getValue(params.id, "lastName") || ""
  //       }`,
  //   },
];

const UserList = () => {
  const [Users, setUsers] = useState([]);
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [Loading, setLoading] = useState(false);
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

  const [select, setSelection] = React.useState([]);

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
          columns={columns}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
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
