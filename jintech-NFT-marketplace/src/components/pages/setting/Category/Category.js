import {
  Button,
  Paper,
  Box,
  List,
  IconButton,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import styles from "./Category.module.css";

const Category = (props) => {
  const [checked, setChecked] = React.useState([0]);
  const [AllChecked, setAllChecked] = useState(false);
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

  const checkAllHandler = () => {
    const allCheck = [];
    if (!AllChecked) {
      for (let i = 0; i < 4; i++) {
        allCheck.push(i);
      }
    }
    setChecked(allCheck);
    setAllChecked((prev) => !prev);
  };

  return (
    <>
      <h4 className={styles["head-text"]}>Category</h4>

      <Paper elevation={3}>
        <div className={styles["header"]}>
          <Button onClick={checkAllHandler}>All</Button>
          <div className={styles["btn-div"]}>
            <Button>Edit</Button>
            <Button>Add</Button>
            <Button>Delete</Button>
          </div>
        </div>

        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {[0, 1, 2, 3].map((value) => {
            const labelId = `checkbox-list-label-${value}`;

            return (
              <ListItem
                key={value}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments">
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(value)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={`Line item ${value + 1}`}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </>
  );
};

export default Category;
