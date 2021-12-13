import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./UserList.module.css";
import Card from "../UI/Card/Card";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router";

const columns = [
  { field: "id", headerName: "ID", width: 170 },
  { field: "email", headerName: "E-Mail", width: 230 },
  { field: "created", headerName: "생성일", width: 230 },
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

  const getUsers = useCallback(() => {
    if (authCtx.isAdmin) {
        const body = {
            token: authCtx.token
        }
      axios.post("api/users/allUsers", body).then((res) => {
        const users = res.data.map((v, i) => {
          // 관리자 db 열 없음
          return {
            id: i,
            email: v.email,
            created: new Date(v.createdAt),
            auth: v.auth,
          };
        });
        setUsers(users);
      });
    } else {
      alert("관리자 계정이 아닙니다.");
      history.push("/");
    }
  }, [authCtx.isAdmin, history, authCtx.token]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <Card className={styles["content"]}>
      <DataGrid
        rows={Users}
        columns={columns}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </Card>
  );
};

export default UserList;
