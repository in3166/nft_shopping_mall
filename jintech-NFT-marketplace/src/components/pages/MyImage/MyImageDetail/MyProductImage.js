import { Avatar, Box, Card } from "@mui/material";
import { borderRadius } from "@mui/system";
import React, { useState } from "react";
import LinkIcon from "@mui/icons-material/Link";

const MyProductImage = (props) => {
  const { url, Image } = props;

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
      <div style={{ display: "flex", marginLeft: 8 }}>
        <h5>{Image?.name}</h5>
      </div>

      <div
        style={{
          display: "flex",
          paddingTop: 20,
          paddingBottom: 14,
          // alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", marginLeft: 5 }}>
          <Avatar src="/broken-image.jpg" />
          <div
            style={{
              marginLeft: 10,
              lineHeight: 1,
              paddingTop: 2,
              alignSelf: "center",
            }}
          >
            <label
              style={{
                fontWeight: "bold",
                color: "black",
                margin: 0,
                marginBottom: "3px",
              }}
            >
              Owner
            </label>
            <br />
            <label style={{ margin: 0 }}>{Image.ownerEmail}</label>
          </div>
        </div>
        <br />
        <div style={{ display: "flex", marginLeft: 5, overflow: "hidden" }}>
          <div
            style={{
              padding: "6px",
              border: "2px solid grey",
              borderRadius: "50%",
              alignSelf: "center",
            }}
          >
            <LinkIcon />
          </div>
          <div
            style={{
              marginLeft: 10,
              lineHeight: 1,
              paddingTop: 2,
              overflow: "hidden",
              alignSelf: "center",
            }}
          >
            <label
              style={{
                fontWeight: "bold",
                color: "black",
                margin: 0,
                marginBottom: "3px",
              }}
            >
              Url
            </label>
            <br />
            <label
              title={Image.url}
              style={{
                maxWidth: "100%",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                margin: 0,
              }}
            >
              {Image.url}
            </label>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default MyProductImage;
