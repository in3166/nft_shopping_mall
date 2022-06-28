import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
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
  const [Loading, setLoading] = useState(false);
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
          return v.email;
        });
        const admin = res.data.admin.map((v, i) => {
          return v.email;
        });
        if (isMount) setLeft(users);
        if (isMount) setRight(admin);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isMount]);

  useEffect(() => {
    getUsers();

    return () => {
      setisMount(false);
    };
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
    const body = {
      user: leftChecked,
      toUser: false,
    };
    axios
      .post("/api/users/role", body)
      .then((res) => {
        if (!res.data.success) {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    console.log(rightChecked);
    const body = {
      user: rightChecked,
      toUser: true,
    };
    axios
      .post("/api/users/role", body)
      .then((res) => {
        if (!res.data.success) {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card sx={{ margin: "20px 0px 20px 0px", width: "100%" }}>
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
          width: "100%",
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
              key={value}
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
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid
      container
      spacing={2}
      columns={18}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={18} md={8} lg={6}>
        {customList("User", left)}
      </Grid>
      <Grid item xs={18} md={2} lg={4}>
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
      <Grid item xs={18} md={8} lg={6}>
        {customList("Admin", right)}
      </Grid>
    </Grid>
  );
};

export default AdminManager;
