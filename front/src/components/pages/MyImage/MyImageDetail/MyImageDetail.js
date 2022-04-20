import { Box, Grid } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

import MyProductImage from "./MyProductImage";
import MyProductInfo from "./MyProductInfo";

const MyImageDetail = ({ match }) => {
  const id = match.params.id;

  const [Image, setImage] = useState({});
  const [Categories, setCategories] = useState([]);
  const getImageInfo = useCallback(() => {
    axios
      .get("/api/marketplaces/goods/" + id)
      .then((res) => {
        console.log("sale: ", res.data.info);
        setImage(res.data.info);
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {});
  }, [id]);

  const getAllCategories = useCallback(() => {
    axios
      .get("/api/categories")
      .then((res) => {
        console.log("getAllCategories: ", res.data.data);
        setCategories(res.data.data);
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {});
  }, []);

  useEffect(() => {
    getImageInfo();
    getAllCategories();
  }, [getImageInfo, getAllCategories]);

  return (
    <Box sx={{ p: 2, pt: 4, overflow: "auto" }}>
      {Image.id && (
        <Grid container spacing={4} columns={18}>
          <Grid item xs={18} sm={9}>
            <MyProductImage Image={Image} url={Image?.url} />
          </Grid>
          <Grid item xs={18} sm={9}>
            <MyProductInfo Image={Image} setImage={setImage} Categories={Categories} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MyImageDetail;
