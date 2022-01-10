import { Box, CircularProgress, Grid, Stack } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

import ProductDetail from "./Sections/ProductDetail";
import ProductImage from "./Sections/ProductImage";
import styles from "./Sale.module.css";

const Sale = ({ match }) => {
  const id = match.params.id;
  const [Image, setImage] = useState({});
  const [Loading, setLoading] = useState(false);

  const getImageInfo = useCallback(() => {
    setLoading(true);
    axios
      .get("/api/marketplaces/goods/" + id)
      .then((res) => {
        console.log("sale: ", res.data.info);
        setImage(res.data.info);
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

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
        <Box sx={{ p: 2, pt: 4 }}>
          <Grid container spacing={6} columns={18}>
            <Grid item xs={18} sm={9}>
              <ProductImage url={Image?.image?.url} />
            </Grid>
            <Grid item xs={18} sm={9}>
              <ProductDetail Image={Image} setImage={setImage} />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Sale;
