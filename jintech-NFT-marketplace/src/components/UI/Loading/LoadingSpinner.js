import { CircularProgress, Stack } from "@mui/material";
import React from "react";
import styles from './Loading.module.css';

const Loading = (props) => {
  return (
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
  );
};

export default Loading;
