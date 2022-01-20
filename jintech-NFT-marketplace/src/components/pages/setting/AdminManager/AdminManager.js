import {
  Button,
  List,
  ListItemIcon,
  Checkbox,
  ListItem,
  ListItemText,
  Grid,
  Card,
  CardHeader,
  Divider,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./AdminManager.module.css";
import axios from "axios";
import { useSelector } from "react-redux";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const AdminManager = (props) => {
  const state = useSelector((state) => state.user);
  const gridRef = useRef();
  const [DeletedCategoriesId, setDeletedCategoriesId] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Users, setUsers] = useState([]);
  const [isMount, setisMount] = useState(true);

  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const getUsers = useCallback(() => {
    setLoading(true);

    axios
      .get("api/users/settings")
      .then((res) => {
        console.log(res);
        const users = res.data.user.map((v, i) => {
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
        const admin = res.data.admin.map((v, i) => {
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
        if (isMount) setLeft(users);
        if (isMount) setRight(admin);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [state.user.email, isMount]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    console.log(leftChecked);
    axios.post('/api/usres/role').then(res=>{
      if(res.data.success){
        
      }
    })
    .catch(err=>{
      alert(err);
    })
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card sx={{ margin: "20px 0px 20px 0px" }}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 300,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.email}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList("User", left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList("Admin", right)}</Grid>
    </Grid>
  );
};

export default AdminManager;
