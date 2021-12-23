import { Divider, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Card from "../UI/Card/Card";
import styles from "./UserUpload.module.css";
import UploadAuction from "./Sections/UploadAuction";
import UploadSale from "./Sections/UploadSale";
import { useSelector } from "react-redux";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={+value !== +index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {+value === +index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const UserUpload = (props) => {
  const history = useHistory();
  const user = useSelector((state) => state?.user?.user);
  const getAccount = useCallback(async () => {
    const accounts = await window.web3.eth.getAccounts();
    console.log(accounts[0]);
    console.log("user: ", user);
    if (accounts && user.email !== "") {
      await axios
        .get(`/api/users/user/${user.email}`)
        .then((res) => {
          console.log("res : ", res.data.address);
          if (accounts[0] !== res.data.address) {
            if (user.isLoggedIn) {
              alert("지갑 주소가 맞지 않습니다.");
              history.replace("/");
            }
            //user.walletAddress = accounts[0];
          }
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    }
  }, [history, user]);

  useEffect(() => {
    getAccount();
  }, [getAccount]);

  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card>
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          border: "1px rgb(196, 196, 196) solid",
        }}
      >
        <h5 style={{ marginBottom: "0rem" }}>상품 등록</h5>
      </Box>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="primary tabs example"
        defaultChecked="1"
      >
        <Tab
          value={1}
          label={<span className={styles.tabLabel}>경매 등록</span>}
          {...a11yProps(0)}
        />
        <Tab
          value={2}
          label={<span className={styles.tabLabel}>판매 등록</span>}
          {...a11yProps(1)}
        />
      </Tabs>
      <Divider />
      <TabPanel value={value} index={1} user={user}>
        <UploadAuction />
      </TabPanel>
      <TabPanel value={value} index={2} user={user}>
        <UploadSale />
      </TabPanel>
    </Card>
  );
};

export default UserUpload;
