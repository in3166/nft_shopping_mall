import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Box, CircularProgress, Grid, Stack } from "@mui/material";

import ProductInfo from "./Sections/ProductInfo";
import ProductImage from "./Sections/ProductImage";
import styles from "./ProductDetail.module.css";
import ViewCounts from "../../util/ViewCounts";

const ProductDetail = ({ match }) => {
  const id = match.params.id;
  const user = useSelector((state) => state.user.user);
  const [Image, setImage] = useState({});
  const [Loading, setLoading] = useState(false);

  const getImageInfo = useCallback(() => {
    setLoading(true);
    axios
      .get("/api/marketplaces/goods/" + id)
      .then((res) => {
        console.log("sale: ", res.data.info);
        setImage(res.data.info);
        ViewCounts(window.location.pathname, user.email, {
          marketplaceId: res.data.info.id,
        });
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, user.email]);

  useEffect(() => {
    getImageInfo();
  }, [getImageInfo]);

  return (
    <>
      {Loading && (
        <Stack
          sx={{
            color: "grey.500",
            width: "100%",
            minHeight: "250px",
            justifyContent: "center",
            alignItems: "center",
          }}
          spacing={2}
          direction="row"
          className={styles.loading}
        >
          <CircularProgress color="inherit" />
        </Stack>
      )}

      {!Loading && (
        <Box sx={{ p: 2, pt: 4, overflow: "auto" }}>
          <Grid container spacing={6} columns={18}>
            <Grid item xs={18} sm={9}>
              <ProductImage url={Image?.url} />
            </Grid>
            <Grid item xs={18} sm={9}>
              <ProductInfo Image={Image} setImage={setImage} />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default ProductDetail;
