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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleDeleteClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteClose = () => {
    setAnchorEl(null);
  };

  const deleteOpen = Boolean(anchorEl);
  const id = deleteOpen ? "simple-popover" : undefined;

  const [addOpen, setAddOpen] = useState(false);

  const handleClickAddOpen = () => {
    setAddOpen(true);
  };

  const handleAddClose = () => {
    setAddOpen(false);
  };

  return (
    <>
      <h4 className={styles["head-text"]}>Category</h4>

      <Paper elevation={3}>
        <div className={styles["header"]}>
          <Button onClick={checkAllHandler}>All</Button>
          <div className={styles["btn-div"]}>
            <Button onClick={handleClickAddOpen}>Edit</Button>
            <Button onClick={handleClickAddOpen}>Add</Button>
            <Button onClick={handleDeleteClick}>Delete</Button>
          </div>
        </div>

        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {[0, 1, 2, 3].map((value) => {
            const labelId = `checkbox-list-label-${value}`;

            return (
              <ListItem
                key={value}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="comments"
                    onClick={handleDeleteClick}
                  >
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
              <Button>취소</Button>
              <Button>삭제</Button>
            </div>
          </Popover>
        </List>
      </Paper>

      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            추가할 카테고리 이름을 입력하세요.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="category"
            label="Category"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>취소</Button>
          <Button onClick={handleAddClose}>추가</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Category;
