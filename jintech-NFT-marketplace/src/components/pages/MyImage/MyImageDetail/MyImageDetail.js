import { Box, Grid } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MyProductImage from "./MyProductImage";
import MyProductInfo from "./MyProductInfo";

const MyImageDetail = ({ match }) => {
  const id = match.params.id;
  const user = useSelector((state) => state.user.user);
  const [Image, setImage] = useState({});

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

  useEffect(() => {
    getImageInfo();
  }, [getImageInfo]);

  return (
    <Box sx={{ p: 2, pt: 4, overflow: "auto" }}>
      {Image.id && (
        <Grid container spacing={4} columns={18}>
          <Grid item xs={18} sm={9}>
            <MyProductImage Image={Image} url={Image?.image?.url} />
          </Grid>
          <Grid item xs={18} sm={9}>
            <MyProductInfo Image={Image} setImage={setImage} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MyImageDetail;
