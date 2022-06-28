import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
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
import styles from "./Category.module.css";

const Category = (props) => {
  const [checked, setChecked] = useState([]);
  const [AllChecked, setAllChecked] = useState(false);
  const [Categories, setCategories] = useState([]);
  const [IsMount, setIsMount] = useState(true);

  const getAllCategories = useCallback(() => {
    axios
      .get("/api/categories/")
      .then((res) => {
        if (res.data.success) {
          if (IsMount) setCategories(res.data.data);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, [IsMount]);

  useEffect(() => {
    getAllCategories();
    return () => {
      setIsMount(false);
    };
  }, [getAllCategories]);

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
      Categories.forEach((v) => {
        allCheck.push(v.id);
      });
    }
    setChecked(allCheck);
    setAllChecked((prev) => !prev);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const [DeletedCategoriesId, setDeletedCategoriesId] = useState([]);
  const handleDeleteClick = (event, value) => {
    setAnchorEl(event.currentTarget);
    if (!!value) {
      setDeletedCategoriesId([value.id]);
    } else {
      setDeletedCategoriesId(checked);
    }
  };

  const handleDeleteClose = () => {
    setAnchorEl(null);
    setDeletedCategoriesId([]);
  };

  const handleDeleteSubmit = async () => {
    if (DeletedCategoriesId?.length < 1) {
      alert("하나 이상의 항목을 선택하세요.");
      handleDeleteClose();
      return;
    }

    try {
      const response = await axios.delete("/api/categories/", {
        data: {
          id: DeletedCategoriesId,
        },
      });
      if (response.data.success) {
        alert("카테고리를 삭제하였습니다.");
        getAllCategories();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error);
    } finally {
      handleDeleteClose();
    }
  };

  const deleteOpen = Boolean(anchorEl);
  const id = deleteOpen ? "simple-popover" : undefined;

  const [isAdd, setIsAdd] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const handleClickAddOpen = () => {
    setAddOpen(true);
    setIsAdd(true);
  };
  const handleClickEditOpen = (data) => {
    setEnteredCategory({ id: data.id, name: data.name });
    setIsAdd(false);
    setAddOpen(true);
  };
  const handleAddClose = () => {
    setAddOpen(false);
    setEnteredCategory({});
  };

  const [EnteredCategory, setEnteredCategory] = useState({});
  const handleAddSubmit = async () => {
    let response;
    try {
      if (isAdd) {
        response = await axios.post("/api/categories/", EnteredCategory);
        if (response.data.success) {
          alert("카테고리를 추가하였습니다.");
          getAllCategories();
        }
      } else {
        response = await axios.put("/api/categories/", EnteredCategory);
        if (response.data.success) {
          alert("카테고리를 수정하였습니다.");
          getAllCategories();
        }
      }
      if (!response.data.success) {
        alert(response.data.message);
      }
      handleAddClose();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <h4 className={styles["head-text"]}>Category</h4>

      <Paper elevation={3}>
        <div className={styles["header"]}>
          <Button onClick={checkAllHandler}>All</Button>
          <div className={styles["btn-div"]}>
            <Button onClick={handleClickAddOpen}>Add</Button>
            <Button onClick={handleDeleteClick}>Delete</Button>
          </div>
        </div>

        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {Categories?.length > 0 &&
            Categories.map((value) => {
              const labelId = `checkbox-list-label-${value.name}`;

              return (
                <ListItem
                  key={value.id}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="comments"
                        onClick={() => handleClickEditOpen(value)}
                        sx={{ marginRight: 0.1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="comments"
                        onClick={(e) => handleDeleteClick(e, value)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                  disablePadding
                >
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle(value.id)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(value.id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${value.name}`} />
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
              <Button onClick={handleDeleteClose}>취소</Button>
              <Button onClick={handleDeleteSubmit}>삭제</Button>
            </div>
          </Popover>
        </List>
      </Paper>

      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>{isAdd ? "Add" : "Edit"} Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isAdd ? "추가" : "수정"}할 카테고리 이름을 입력하세요.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="category"
            label="Category"
            type="text"
            fullWidth
            variant="standard"
            value={EnteredCategory.name || ""}
            onChange={(e) =>
              setEnteredCategory((prev) => {
                return { ...prev, name: e.target.value };
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>취소</Button>
          <Button onClick={handleAddSubmit}>{isAdd ? "추가" : "수정"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Category;
