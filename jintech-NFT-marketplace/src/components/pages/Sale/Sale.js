import { Box, Grid } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

import ProductDetail from "./Sections/ProductDetail";
import ProductImage from "./Sections/ProductImage";

const Sale = ({ match }) => {
  const id = match.params.id;
  const [Image, setImage] = useState({});

  const getImageInfo = useCallback(() => {
    axios
      .get("/api/marketplaces/goods/" + id)
      .then((res) => {
        console.log(res.data.info);
        setImage(res.data.info);
      })
      .catch((err) => {
        alert(err);
      });
  }, [id]);

  useEffect(() => {
    getImageInfo();
  }, [getImageInfo]);

  return (
    <Box sx={{ p: 2, pt: 4 }}>
      <Grid container spacing={6} columns={18}>
        <Grid item xs={18} sm={9}>
          <ProductImage url={Image.url} />
        </Grid>
        <Grid item xs={18} sm={9}>
          <ProductDetail Image={Image} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Sale;
