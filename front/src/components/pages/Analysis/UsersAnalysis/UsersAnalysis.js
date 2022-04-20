import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UserInfoModal from "./Sections/UserInfoModal";

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
    field: "created",
    headerName: "생성일",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
];

const UsersAnalysis = () => {
  const user = useSelector((state) => state.user.user);

  const gridRef = useRef();

  const [isMount, setisMount] = useState(true);
  const [Users, setUsers] = useState([]);
  const [ModalOpen, setModalOpen] = useState(false);
  const [SelectedUser, setSelectedUser] = useState({});
  const [Loading, setLoading] = useState(false);

  const getUsers = useCallback(() => {
    setLoading(true);

    const body = {
      email: user.email,
    };

    axios
      .get("api/users/allUsers", body)
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
            address: v.address,
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

  const rowClickHandler = (data) => {
    console.log(data.row);
    setSelectedUser(data.row);
    setModalOpen(true);

  };

  return (
    <>
      <h5>User List</h5>
      <DataGrid
        rows={Users}
        columns={columns}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        ref={gridRef}
        onRowClick={rowClickHandler}
        sx={{ cursor: "pointer" }}
      />
      {ModalOpen && (
        <UserInfoModal
          open={ModalOpen}
          user={SelectedUser}
          setModalOpen={setModalOpen}
        />
      )}
    </>
  );
};

export default UsersAnalysis;
