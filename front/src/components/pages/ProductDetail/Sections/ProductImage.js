import { Box, Card } from "@mui/material";
import { borderRadius } from "@mui/system";
import React, { useState } from "react";

const ProductImage = (props) => {
  const { url } = props;

  return (
    <Box sx={{ margin: "0.5rem", width: "100%" }}>
      <Card
        sx={{
          maxHeight: 450,
          minHeight: 170,
          backgroundColor: "transparent",
          overflow: "hidden",
          objectFit: "contain",
          boxShadow: "none",
          width: "100%",
        }}
      >
        <img
          src={url}
          alt="goods"
          style={{
            objectFit: "contain",
            maxHeight: 450,
            height: "100%",
            maxWidth: "100%",
            width: "100%",
            display: "block",
            borderRadius: "10px",
          }}
          //className={styles.images}
        />
      </Card>
        <br />
      <div style={{ width: "100%" }}>
        <label>Contract Address</label>
        <br />
        <label>Token ID</label>
      </div>
    </Box>
  );
};

export default ProductImage;
